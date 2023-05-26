package ebayapp.core.clients

import ebayapp.core.domain.Notification

trait MessengerClient[F[_]]:
  def send(notification: Notification): F[Unit]
