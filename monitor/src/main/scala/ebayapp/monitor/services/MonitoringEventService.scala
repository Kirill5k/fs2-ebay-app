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

import scala.concurrent.duration.FiniteDuration

final private case class PendingMonitor(
    monitor: Monitor,
    previousEvent: Option[MonitoringEvent]
) {
  def previousCheck: Option[MonitoringEvent.StatusCheck] = previousEvent.map(_.statusCheck)
  def downTime: Option[FiniteDuration]                   = previousEvent.flatMap(_.downTime)
}

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
          (downTime, message) = compareStatus(currentCheck, pending.previousCheck, pending.downTime)
          event               = MonitoringEvent(pending.monitor.id, currentCheck, downTime)
          _ <- repository.save(event)
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
      downTime: Option[FiniteDuration]
  ): (Option[FiniteDuration], Option[Notification.Message]) = ???

object MonitoringEventService {}
