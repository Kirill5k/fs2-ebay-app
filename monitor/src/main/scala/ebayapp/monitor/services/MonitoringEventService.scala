package ebayapp.monitor.services

import cats.effect.std.Queue
import ebayapp.monitor.actions.ActionDispatcher
import ebayapp.monitor.clients.HttpClient
import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import ebayapp.monitor.repositories.MonitoringEventRepository
import fs2.Stream

trait MonitoringEventService[F[_]]:
  def findLatestEvent(id: Monitor.Id): F[Option[MonitoringEvent]]
  def enqueue(monitor: Monitor, previousEvent: Option[MonitoringEvent]): F[Unit]
  def process: Stream[F, Unit]

final private class LiveMonitoringEventService[F[_]](
    private val monitors: Queue[F, Monitor],
    private val actionDispatcher: ActionDispatcher[F],
    private val repository: MonitoringEventRepository[F],
    private val httpClient: HttpClient[F]
)
