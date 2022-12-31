package ebayapp.kernel.controllers

import ebayapp.kernel.errors.AppError
import io.circe.Encoder
import io.circe.{Codec, Encoder}
import io.circe.syntax.*

object views {
  sealed trait ErrorResponse:
    def message: String

  object ErrorResponse {
    final case class InternalError(message: String)       extends ErrorResponse derives Codec.AsObject
    final case class BadRequest(message: String)          extends ErrorResponse derives Codec.AsObject
    final case class NotFound(message: String)            extends ErrorResponse derives Codec.AsObject
    final case class UnprocessableEntity(message: String) extends ErrorResponse derives Codec.AsObject

    def from(err: Throwable): ErrorResponse = err match {
      case e: AppError.Failed   => BadRequest(e.message)
      case e: AppError.NotFound => NotFound(e.message)
      case e: AppError.Invalid  => UnprocessableEntity(e.message)
      case e: Throwable         => InternalError(e.getMessage)
    }

    inline given Encoder[ErrorResponse] = Encoder.instance {
      case e: UnprocessableEntity => e.asJson
      case e: BadRequest          => e.asJson
      case e: InternalError       => e.asJson
      case e: NotFound            => e.asJson
    }
  }
}
