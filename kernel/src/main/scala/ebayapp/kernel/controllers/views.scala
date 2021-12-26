package ebayapp.kernel.controllers

import ebayapp.kernel.errors.AppError
import io.circe.Encoder
import io.circe.{Codec, Encoder}
import io.circe.syntax.*
import io.circe.generic.auto.*

object views {
  sealed trait ErrorResponse {
    def message: String
  }

  object ErrorResponse {
    final case class InternalError(message: String) extends ErrorResponse
    final case class BadRequest(message: String)    extends ErrorResponse
    final case class NotFound(message: String)      extends ErrorResponse

    def from(err: Throwable): ErrorResponse = err match {
      case e: AppError.NotFound => NotFound(e.message)
      case e: Throwable         => InternalError(err.getMessage)
    }

    given encodeError: Encoder[ErrorResponse] = Encoder.instance {
      case e: BadRequest    => e.asJson
      case e: InternalError => e.asJson
      case e: NotFound      => e.asJson
    }
  }
}
