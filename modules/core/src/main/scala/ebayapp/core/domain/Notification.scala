package ebayapp.core.domain

enum Notification(val title: String, val message: String, val item: Option[ResellableItem] = None):
  case Alert(
      override val title: String,
      override val message: String,
      override val item: Option[ResellableItem] = None
  ) extends Notification(title, message, item)
  case Deal(
      override val title: String,
      override val message: String,
      override val item: Option[ResellableItem] = None
  ) extends Notification(title, message, item)
  case Stock(
      override val title: String,
      override val message: String,
      override val item: Option[ResellableItem] = None
  ) extends Notification(title, message, item)
