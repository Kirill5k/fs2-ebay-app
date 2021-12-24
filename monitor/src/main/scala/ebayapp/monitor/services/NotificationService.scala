package ebayapp.monitor.services

import ebayapp.monitor.domain.Notification

trait NotificationService[F[_]]:
  def notify(notification: Notification): F[Unit]
