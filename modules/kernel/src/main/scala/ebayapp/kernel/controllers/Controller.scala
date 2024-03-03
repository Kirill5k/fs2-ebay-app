package ebayapp.kernel.controllers

import cats.MonadThrow
import cats.effect.*
import cats.syntax.functor.*
import cats.syntax.either.*
import cats.syntax.applicativeError.*
import kirill5k.common.syntax.time.*
import ebayapp.kernel.controllers.views.*
import org.http4s.HttpRoutes
import sttp.model.StatusCode
import sttp.tapir.Codec.PlainCodec
import sttp.tapir.json.circe.TapirJsonCirce
import sttp.tapir.generic.auto.SchemaDerivation
import sttp.tapir.server.http4s.{Http4sServerInterpreter, Http4sServerOptions}
import sttp.tapir.server.model.ValuedEndpointOutput
import sttp.tapir.{oneOf, oneOfDefaultVariant, oneOfVariant, Codec, DecodeResult}

import java.time.Instant

trait Controller[F[_]] {
  def routes: HttpRoutes[F]

  protected def serverInterpreter(using F: Async[F]): Http4sServerInterpreter[F] =
    Http4sServerInterpreter[F] {
      Http4sServerOptions.customiseInterceptors
        .defaultHandlers((e: String) => ValuedEndpointOutput(Controller.badRequestResponse, ErrorResponse.BadRequest(e)))
        .options
    }

  extension [A](fa: F[A])(using F: MonadThrow[F])
    def voidResponse: F[Either[ErrorResponse, Unit]] = mapResponse(_ => ())
    def mapResponse[B](fab: A => B): F[Either[ErrorResponse, B]] =
      fa
        .map(fab(_).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft[B])
}

object Controller extends TapirJsonCirce with SchemaDerivation {

  inline given PlainCodec[Instant] =
    Codec.string.mapDecode(d => d.toInstant.fold(DecodeResult.Error(d, _), DecodeResult.Value(_)))(_.toString)
  
  val badRequestResponse = jsonBody[ErrorResponse.BadRequest]

  val errorResponse =
    oneOf[ErrorResponse](
      oneOfVariant(StatusCode.UnprocessableEntity, jsonBody[ErrorResponse.UnprocessableEntity]),
      oneOfVariant(StatusCode.NotFound, jsonBody[ErrorResponse.NotFound]),
      oneOfVariant(StatusCode.InternalServerError, jsonBody[ErrorResponse.InternalError]),
      oneOfDefaultVariant(jsonBody[ErrorResponse.BadRequest])
    )
}
