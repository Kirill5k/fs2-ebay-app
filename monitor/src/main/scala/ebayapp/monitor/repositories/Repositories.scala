package ebayapp.monitor.repositories

trait Repositories[F[_]]:
  def monitor: MonitorRepository[F]
  def monitoringEvent: MonitoringEventRepository[F]
