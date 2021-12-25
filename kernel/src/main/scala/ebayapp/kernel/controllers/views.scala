package ebayapp.kernel.controllers

import io.circe.Encoder

import io.circe.{Encoder, Codec}
import io.circe.syntax.*
import io.circe.generic.auto.*

object views {
  sealed trait ErrorResponse {
    def message: String
  }

  object ErrorResponse {
    final case class InternalError(message: String) extends ErrorResponse
    final case class BadRequest(message: String)    extends ErrorResponse

    def from(err: Throwable): ErrorResponse = InternalError(err.getMessage)

    given encodeError: Encoder[ErrorResponse] = Encoder.instance {
      case e: BadRequest    => e.asJson
      case e: InternalError => e.asJson
    }
  }
}
