package kirill5k.ebayapp.common

object errors {
  sealed trait ApplicationError extends Throwable {
    def message: String
    override def getMessage: String = message
  }

  object ApplicationError {
    final case class Http(status: Int, message: String) extends ApplicationError
    final case class Internal(message: String)          extends ApplicationError
    final case class Auth(message: String)              extends ApplicationError
    final case class Json(message: String)              extends ApplicationError
    final case class Db(message: String)                extends ApplicationError
    final case class NotEnoughDetails(message: String)  extends ApplicationError
  }
}
