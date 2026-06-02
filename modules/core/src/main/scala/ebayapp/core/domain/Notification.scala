package ebayapp.core.domain

enum Notification(val title: String, val message: String, val url: Option[String] = None, val image: Option[String] = None):
  case Alert(override val title: String, override val message: String, override val url: Option[String] = None, override val image: Option[String] = None) extends Notification(title, message, url, image)
  case Deal(override val title: String, override val message: String, override val url: Option[String] = None, override val image: Option[String] = None)  extends Notification(title, message, url, image)
  case Stock(override val title: String, override val message: String, override val url: Option[String] = None, override val image: Option[String] = None) extends Notification(title, message, url, image)
