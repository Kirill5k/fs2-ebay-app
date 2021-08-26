package ebayapp.core.clients

sealed trait Notification {
  def message: String
}

object Notification {
  final case class Alert(message: String) extends Notification
  final case class Deal(message: String)  extends Notification
  final case class Stock(message: String) extends Notification
}

trait MessengerClient[F[_]] {
  def send(notification: Notification): F[Unit]
}
