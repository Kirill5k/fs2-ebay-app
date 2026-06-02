package ebayapp.core.domain

enum Notification(val title: String, val message: String):
  case Alert(override val title: String, override val message: String) extends Notification(title, message)
  case Deal(override val title: String, override val message: String)  extends Notification(title, message)
  case Stock(override val title: String, override val message: String) extends Notification(title, message)
