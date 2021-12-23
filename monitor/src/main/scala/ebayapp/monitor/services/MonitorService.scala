package ebayapp.monitor.services

import ebayapp.monitor.domain.{CreateMonitor, Monitor}
import fs2.Stream

trait MonitorService[F[_]]:
  def create(monitor: CreateMonitor): F[Monitor]
  def find(id: Monitor.Id): F[Option[Monitor]]
  def enqueue(monitor: Monitor): F[Unit]
  def process: Stream[F, Unit]
