package ebayapp.monitor.services

import ebayapp.monitor.domain.{Notification, Monitor}

trait NotificationService[F[_]]:
  def notify(monitor: Monitor, notification: Notification): F[Unit]
