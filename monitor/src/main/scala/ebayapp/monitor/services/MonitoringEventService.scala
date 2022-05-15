package ebayapp.monitor.services

import cats.Monad
import cats.effect.Temporal
import cats.effect.std.Queue
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.clients.HttpClient
import ebayapp.monitor.domain.Monitor.Connection
import ebayapp.monitor.domain.{Monitor, MonitoringEvent, Notification}
import ebayapp.monitor.repositories.MonitoringEventRepository

import java.time.Instant
import scala.concurrent.duration.*

trait MonitoringEventService[F[_]]:
  def find(monitorId: Monitor.Id): F[List[MonitoringEvent]]
  def findLatest(monitorId: Monitor.Id): F[Option[MonitoringEvent]]
  def process(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit]

final private class LiveMonitoringEventService[F[_]](
    private val dispatcher: ActionDispatcher[F],
    private val repository: MonitoringEventRepository[F],
    private val httpClient: HttpClient[F]
)(using
    F: Temporal[F]
) extends MonitoringEventService[F]:

  def find(monitorId: Monitor.Id): F[List[MonitoringEvent]] =
    repository.findAllBy(monitorId)

  def findLatest(monitorId: Monitor.Id): F[Option[MonitoringEvent]] =
    repository.findLatestBy(monitorId)

  def process(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit] =
    for
      currentCheck <- if (monitor.active) checkStatus(monitor) else pausedStatus
      (downTime, notification) = compareStatus(currentCheck, previousEvent.map(_.statusCheck), previousEvent.flatMap(_.downTime))
      event                    = MonitoringEvent(monitor.id, currentCheck, downTime)
      _ <- repository.save(event)
      _ <- F.whenA(notification.nonEmpty)(dispatcher.dispatch(Action.Notify(monitor, notification.get)))
      _ <- dispatcher.dispatch(Action.Requeue(monitor.id, monitor.interval - currentCheck.responseTime, event))
    yield ()

  private def checkStatus(monitor: Monitor): F[MonitoringEvent.StatusCheck] =
    monitor.connection match
      case http: Connection.Http => httpClient.status(http)

  private def pausedStatus: F[MonitoringEvent.StatusCheck] =
    F.realTimeInstant.map(t => MonitoringEvent.StatusCheck(Monitor.Status.Paused, 0.millis, t, "Paused"))

  private def compareStatus(
      current: MonitoringEvent.StatusCheck,
      previous: Option[MonitoringEvent.StatusCheck],
      downTime: Option[Instant]
  ): (Option[Instant], Option[Notification]) =
    (current.status, previous.map(_.status)) match
      case (Monitor.Status.Up, Some(Monitor.Status.Paused)) =>
        (None, None)
      case (Monitor.Status.Down, Some(Monitor.Status.Paused)) =>
        (Some(current.time), None)
      case (Monitor.Status.Paused, _) =>
        (None, None)
      case (Monitor.Status.Down, None) =>
        (Some(current.time), None)
      case (Monitor.Status.Up, None) =>
        (None, None)
      case (Monitor.Status.Down, Some(Monitor.Status.Down)) =>
        (downTime, None)
      case (Monitor.Status.Up, Some(Monitor.Status.Up)) =>
        (None, None)
      case (Monitor.Status.Up, Some(Monitor.Status.Down)) =>
        (None, Some(Notification(Monitor.Status.Up, current.time, downTime, current.reason)))
      case (Monitor.Status.Down, Some(Monitor.Status.Up)) =>
        (Some(current.time), Some(Notification(Monitor.Status.Down, current.time, None, current.reason)))

object MonitoringEventService:
  def make[F[_]: Temporal](
      dispatcher: ActionDispatcher[F],
      repository: MonitoringEventRepository[F],
      httpClient: HttpClient[F]
  ): F[MonitoringEventService[F]] =
    Monad[F].pure(LiveMonitoringEventService(dispatcher, repository, httpClient))
