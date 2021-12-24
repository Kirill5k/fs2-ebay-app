package ebayapp.monitor.services

import cats.effect.Concurrent
import cats.effect.std.Queue
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.clients.HttpClient
import ebayapp.monitor.domain.Monitor.Connection
import ebayapp.monitor.domain.{Monitor, MonitoringEvent, Notification}
import ebayapp.monitor.repositories.MonitoringEventRepository
import fs2.Stream
import java.time.Instant

import scala.concurrent.duration.*

final private case class PendingMonitor(
    monitor: Monitor,
    previousEvent: Option[MonitoringEvent]
):
  val previousCheck: Option[MonitoringEvent.StatusCheck] = previousEvent.map(_.statusCheck)
  val downTime: Option[Instant]                          = previousEvent.flatMap(_.downTime)

trait MonitoringEventService[F[_]]:
  def findLatestEvent(monitorId: Monitor.Id): F[Option[MonitoringEvent]]
  def enqueue(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit]
  def process: Stream[F, Unit]

final private class LiveMonitoringEventService[F[_]](
    private val monitors: Queue[F, PendingMonitor],
    private val dispatcher: ActionDispatcher[F],
    private val repository: MonitoringEventRepository[F],
    private val httpClient: HttpClient[F]
)(using
    F: Concurrent[F]
) extends MonitoringEventService[F]:
  private val maxConcurrent: Int = 1024

  def enqueue(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit] =
    monitors.offer(PendingMonitor(monitor, previousEvent))

  def findLatestEvent(monitorId: Monitor.Id): F[Option[MonitoringEvent]] =
    repository.findLatestBy(monitorId)

  def process: Stream[F, Unit] =
    Stream
      .fromQueueUnterminated(monitors)
      .mapAsync(maxConcurrent) { pending =>
        for
          currentCheck <- checkStatus(pending.monitor)
          (downTime, notification) = compareStatus(currentCheck, pending.previousCheck, pending.downTime)
          event                    = MonitoringEvent(pending.monitor.id, currentCheck, downTime)
          _ <- repository.save(event)
          _ <- notification.fold(F.unit)(n => dispatcher.dispatch(Action.Notify(pending.monitor, n)))
          _ <- dispatcher.dispatch(Action.Requeue(pending.monitor.id, pending.monitor.interval, event))
        yield ()
      }

  private def checkStatus(monitor: Monitor): F[MonitoringEvent.StatusCheck] =
    monitor.connection match {
      case http: Connection.Http => httpClient.status(http)
    }

  private def compareStatus(
      current: MonitoringEvent.StatusCheck,
      previous: Option[MonitoringEvent.StatusCheck],
      downTime: Option[Instant]
  ): (Option[Instant], Option[Notification]) =
    (current.status, previous.map(_.status)) match {
      case (Monitor.Status.Down, None) =>
        (Some(current.time), None)
      case (Monitor.Status.Up, None) =>
        (None, None)
      case (Monitor.Status.Down, Some(Monitor.Status.Down)) =>
        (downTime, None)
      case (Monitor.Status.Up, Some(Monitor.Status.Up)) =>
        (None, None)
      case (Monitor.Status.Up, Some(Monitor.Status.Down)) =>
        (downTime, Some(Notification(Monitor.Status.Up, current.time, downTime, current.reason)))
      case (Monitor.Status.Down, Some(Monitor.Status.Up)) =>
        (Some(current.time), Some(Notification(Monitor.Status.Down, current.time, None, current.reason)))
    }

object MonitoringEventService {}
