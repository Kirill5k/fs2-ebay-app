package ebayapp.monitor.services

import cats.effect.Temporal
import cats.effect.std.Queue
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.clients.HttpClient
import ebayapp.monitor.domain.Monitor.Connection
import ebayapp.monitor.domain.{Monitor, MonitoringEvent, Notification}
import ebayapp.monitor.repositories.MonitoringEventRepository
import fs2.Stream
import org.typelevel.log4cats.Logger

import java.time.Instant
import scala.concurrent.duration.*

final private case class PendingMonitor(
    monitor: Monitor,
    previousEvent: Option[MonitoringEvent]
):
  val isActive: Boolean                                  = monitor.active
  val previousCheck: Option[MonitoringEvent.StatusCheck] = previousEvent.map(_.statusCheck)
  val downTime: Option[Instant]                          = previousEvent.flatMap(_.downTime)

trait MonitoringEventService[F[_]]:
  def find(monitorId: Monitor.Id): F[List[MonitoringEvent]]
  def findLatest(monitorId: Monitor.Id): F[Option[MonitoringEvent]]
  def enqueue(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit]
  def process: Stream[F, Unit]

final private class LiveMonitoringEventService[F[_]](
    private val monitors: Queue[F, PendingMonitor],
    private val dispatcher: ActionDispatcher[F],
    private val repository: MonitoringEventRepository[F],
    private val httpClient: HttpClient[F]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends MonitoringEventService[F]:
  private val maxConcurrent: Int = 1024

  def enqueue(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit] =
    monitors.offer(PendingMonitor(monitor, previousEvent))

  def find(monitorId: Monitor.Id): F[List[MonitoringEvent]] =
    repository.findAllBy(monitorId)
  
  def findLatest(monitorId: Monitor.Id): F[Option[MonitoringEvent]] =
    repository.findLatestBy(monitorId)

  def process: Stream[F, Unit] =
    Stream
      .fromQueueUnterminated(monitors)
      .mapAsync(maxConcurrent) { pending =>
        for
          currentCheck <- if (pending.isActive) checkStatus(pending.monitor) else pausedStatus
          (downTime, notification) = compareStatus(currentCheck, pending.previousCheck, pending.downTime)
          event                    = MonitoringEvent(pending.monitor.id, currentCheck, downTime)
          _ <- repository.save(event)
          _ <- notification.fold(F.unit)(n => dispatcher.dispatch(Action.Notify(pending.monitor, n)))
          _ <- dispatcher.dispatch(Action.Requeue(pending.monitor.id, pending.monitor.interval - currentCheck.responseTime, event))
        yield ()
      }
      .handleErrorWith(e => Stream.eval(logger.error(e)("error during monitor processing")) ++ process)

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
  def make[F[_]: Temporal: Logger](
      dispatcher: ActionDispatcher[F],
      repository: MonitoringEventRepository[F],
      httpClient: HttpClient[F]
  ): F[MonitoringEventService[F]] =
    Queue.unbounded[F, PendingMonitor].map(q => LiveMonitoringEventService(q, dispatcher, repository, httpClient))
