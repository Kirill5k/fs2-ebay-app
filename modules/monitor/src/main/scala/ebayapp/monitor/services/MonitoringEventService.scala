package ebayapp.monitor.services

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.kernel.Clock
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.clients.HttpClient
import ebayapp.monitor.domain.Monitor.Connection
import ebayapp.monitor.domain.{Monitor, MonitoringEvent, Notification}
import ebayapp.monitor.repositories.MonitoringEventRepository
import ebayapp.kernel.syntax.time.*
import ebayapp.kernel.syntax.effects.*

import java.time.Instant

trait MonitoringEventService[F[_]]:
  def find(monitorId: Monitor.Id, limit: Int): F[List[MonitoringEvent]]
  def schedule(monitor: Monitor): F[Unit]
  def query(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit]

final private class LiveMonitoringEventService[F[_]](
    private val dispatcher: ActionDispatcher[F],
    private val repository: MonitoringEventRepository[F],
    private val httpClient: HttpClient[F]
)(using
    F: Temporal[F],
    clock: Clock[F]
) extends MonitoringEventService[F]:

  def find(monitorId: Monitor.Id, limit: Int): F[List[MonitoringEvent]] =
    repository.findAllBy(monitorId, limit)

  def schedule(monitor: Monitor): F[Unit] =
    repository
      .findLatestBy(monitor.id)
      .flatMap {
        case None =>
          dispatcher.dispatch(Action.Query(monitor, None))
        case Some(event) =>
          clock.now.flatMap { now =>
            val nextExecTime = monitor.schedule.nextExecutionTime(event.statusCheck.time)
            F.ifTrueOrElse(now.isAfter(nextExecTime))(
              dispatcher.dispatch(Action.Query(monitor, Some(event))),
              dispatcher.dispatch(Action.Reschedule(monitor.id, now.durationBetween(nextExecTime)))
            )
          }
      }

  def query(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit] =
    for
      status <- F.ifTrueOrElse(monitor.active)(checkStatus(monitor), paused)
      (downTime, notification) = compareStatus(status, previousEvent.map(_.statusCheck), previousEvent.flatMap(_.downTime))
      _ <- repository.save(MonitoringEvent(monitor.id, status, downTime))
      _ <- F.whenNonEmpty(notification)(n => dispatcher.dispatch(Action.Notify(monitor, n)))
      _ <- dispatcher.dispatch(Action.Reschedule(monitor.id, monitor.schedule.durationUntilNextExecutionTime(status.time)))
    yield ()

  private def checkStatus(monitor: Monitor): F[MonitoringEvent.StatusCheck] =
    monitor.connection match
      case http: Connection.Http => httpClient.status(http)

  private def paused: F[MonitoringEvent.StatusCheck] =
    clock.now.map(MonitoringEvent.StatusCheck.paused)

  private def compareStatus(
      current: MonitoringEvent.StatusCheck,
      previous: Option[MonitoringEvent.StatusCheck],
      downTime: Option[Instant]
  ): (Option[Instant], Option[Notification]) =
    (current.status, previous.map(_.status)) match
      case (Monitor.Status.Down, Some(Monitor.Status.Paused)) =>
        (Some(current.time), None)
      case (Monitor.Status.Down, None) =>
        (Some(current.time), None)
      case (Monitor.Status.Down, Some(Monitor.Status.Down)) =>
        (downTime, None)
      case (Monitor.Status.Up, Some(Monitor.Status.Down)) =>
        (None, Some(Notification(Monitor.Status.Up, current.time, downTime, current.reason)))
      case (Monitor.Status.Down, Some(Monitor.Status.Up)) =>
        (Some(current.time), Some(Notification(Monitor.Status.Down, current.time, None, current.reason)))
      case _ =>
        (None, None)

object MonitoringEventService:
  def make[F[_]: Temporal: Clock](
      dispatcher: ActionDispatcher[F],
      repository: MonitoringEventRepository[F],
      httpClient: HttpClient[F]
  ): F[MonitoringEventService[F]] =
    Monad[F].pure(LiveMonitoringEventService(dispatcher, repository, httpClient))
