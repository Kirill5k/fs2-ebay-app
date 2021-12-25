package ebayapp.monitor.clients

import ebayapp.monitor.domain.Monitor

trait EmailClient[F[_]]:
  def send(contact: Monitor.Contact.Email, header: String, message: String): F[Unit]
