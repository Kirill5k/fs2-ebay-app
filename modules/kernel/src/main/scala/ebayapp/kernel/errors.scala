package ebayapp.kernel

object errors {
  sealed trait AppError extends Throwable:
    def message: String
    override def getMessage: String = message

  object AppError:
    final case class Http(status: Int, error: String) extends AppError:
      override def message: String = s"HTTP $status - $error"
      
    final case class Auth(message: String)              extends AppError
    final case class Json(message: String)              extends AppError
    final case class Failed(message: String)            extends AppError
    final case class Critical(message: String)          extends AppError
    final case class NotFound(message: String)          extends AppError
    final case class Invalid(message: String)           extends AppError
    
}
