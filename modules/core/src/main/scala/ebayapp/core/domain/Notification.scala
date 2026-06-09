package ebayapp.core.domain

final case class Notification(
    kind: Notification.Kind,
    title: String,
    message: String,
    item: Option[ResellableItem] = None
)

object Notification:
  enum Kind:
    case Alert, Deal, Stock

  def alert(title: String, message: String): Notification =
    Notification(Kind.Alert, title, message)

  def deal(title: String, message: String, item: ResellableItem): Notification =
    Notification(Kind.Deal, title, message, Some(item))

  def stock(title: String, message: String, item: ResellableItem): Notification =
    Notification(Kind.Stock, title, message, Some(item))
