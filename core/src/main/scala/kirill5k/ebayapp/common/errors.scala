package kirill5k.ebayapp.common

object errors {
  sealed trait ApplicationError extends Throwable {
    def message: String
    override def getMessage: String = message
  }

  object ApplicationError {
    final case class HttpError(status: Int, message: String) extends ApplicationError
    final case class InternalError(message: String)          extends ApplicationError
    final case class AuthError(message: String)              extends ApplicationError
    final case class JsonParsingError(message: String)       extends ApplicationError
    final case class DbError(message: String)                extends ApplicationError
    final case class NotEnoughDetailsError(message: String)  extends ApplicationError
  }
}
