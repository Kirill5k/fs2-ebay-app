package ebayapp.core.common

object errors {
  sealed trait AppError extends Throwable {
    def message: String
    override def getMessage: String = message
  }

  object AppError {
    final case class Http(status: Int, message: String) extends AppError
    final case class Auth(message: String)              extends AppError
    final case class Json(message: String)              extends AppError
    final case class Critical(message: String)          extends AppError
  }
}
