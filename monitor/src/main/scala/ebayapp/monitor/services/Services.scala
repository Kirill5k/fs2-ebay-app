package ebayapp.monitor.services

trait Services[F[_]]:
  def monitor: MonitorService[F]
  def monitoringEvent: MonitoringEventService[F]
