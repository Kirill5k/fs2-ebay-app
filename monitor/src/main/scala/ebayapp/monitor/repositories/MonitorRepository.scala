package ebayapp.monitor.repositories

import ebayapp.monitor.domain.Monitor

trait MonitorRepository[F[_]]:
  def save(monitor: Monitor): F[Unit]
  def find(id: Monitor.Id): F[Monitor]
  def pause(id: Monitor.Id): F[Monitor]
  def getAll: F[List[Monitor]]

object MonitorRepository {

}