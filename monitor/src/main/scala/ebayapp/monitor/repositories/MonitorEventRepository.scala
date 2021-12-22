package ebayapp.monitor.repositories

import ebayapp.monitor.domain.{Monitor, MonitorEvent}

trait MonitorEventRepository[F[_]]:
  def save(event: MonitorEvent): F[Unit]
  def findBy(id: Monitor.Id): F[List[MonitorEvent]]

object MonitorEventRepository {

}
