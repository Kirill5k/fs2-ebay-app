package ebayapp.core.domain

enum Notification(val message: String):
  case Alert(override val message: String) extends Notification(message)
  case Deal(override val message: String)  extends Notification(message)
  case Stock(override val message: String) extends Notification(message)
