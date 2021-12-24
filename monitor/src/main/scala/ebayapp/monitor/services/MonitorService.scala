package ebayapp.monitor.services

import cats.effect.std.Queue
import ebayapp.monitor.actions.ActionDispatcher
import ebayapp.monitor.domain.{CreateMonitor, Monitor}
import ebayapp.monitor.repositories.{MonitorRepository, MonitoringEventRepository}
import fs2.Stream

trait MonitorService[F[_]]:
  def getAllActive: F[List[Monitor]]
  def create(monitor: CreateMonitor): F[Monitor]
  def find(id: Monitor.Id): F[Option[Monitor]]

final private class LiveMonitorService[F[_]](
    private val actionDispatcher: ActionDispatcher[F],
    private val repository: MonitorRepository[F],
)
  
