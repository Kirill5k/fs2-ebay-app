package ebayapp.monitor.services

import ebayapp.monitor.domain.{CreateMonitor, Monitor}

trait MonitorService[F[_]]:
  def create(monitor: CreateMonitor): F[Monitor]
