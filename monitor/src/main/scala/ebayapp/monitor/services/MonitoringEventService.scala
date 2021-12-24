package ebayapp.monitor.services

import cats.effect.std.Queue
import ebayapp.monitor.actions.ActionDispatcher
import ebayapp.monitor.clients.HttpClient
import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import ebayapp.monitor.repositories.MonitoringEventRepository
import fs2.Stream

final private case class PendingMonitor(
    monitor: Monitor,
    previousEvent: Option[MonitoringEvent]
)

trait MonitoringEventService[F[_]]:
  def findLatestEvent(monitorId: Monitor.Id): F[Option[MonitoringEvent]]
  def enqueue(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit]
  def process: Stream[F, Unit]

final private class LiveMonitoringEventService[F[_]](
    private val monitors: Queue[F, PendingMonitor],
    private val actionDispatcher: ActionDispatcher[F],
    private val repository: MonitoringEventRepository[F],
    private val httpClient: HttpClient[F]
) extends MonitoringEventService[F]:

  def enqueue(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit] =
    monitors.offer(PendingMonitor(monitor, previousEvent))

  def findLatestEvent(monitorId: Monitor.Id): F[Option[MonitoringEvent]] =
    repository.findLatestBy(monitorId)

  def process: Stream[F, Unit] = ???
