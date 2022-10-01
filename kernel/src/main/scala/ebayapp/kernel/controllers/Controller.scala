package ebayapp.kernel.controllers

import cats.{Monad, MonadThrow}
import cats.effect.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.either.*
import cats.syntax.applicativeError.*
import ebayapp.kernel.common.time.*
import ebayapp.kernel.controllers.views.*
import org.http4s.HttpRoutes
import sttp.model.StatusCode
import sttp.tapir.Codec.PlainCodec
import sttp.tapir.json.circe.TapirJsonCirce
import sttp.tapir.generic.auto.SchemaDerivation
import sttp.tapir.server.http4s.Http4sServerOptions
import sttp.tapir.server.interceptor.DecodeFailureContext
import sttp.tapir.server.model.ValuedEndpointOutput
import sttp.tapir.server.interceptor.exception.ExceptionHandler
import sttp.tapir.{Codec, DecodeResult, ValidationError, oneOf, oneOfDefaultVariant, oneOfVariant}

import java.time.{Instant, LocalDate, LocalDateTime, ZoneOffset}
import scala.util.Try

trait Controller[F[_]] extends TapirJsonCirce with SchemaDerivation {
  
  inline given instantCodec: PlainCodec[Instant] =
    Codec.string.mapDecode(d => d.toInstant.fold(DecodeResult.Error(d, _), DecodeResult.Value(_)))(_.toString)

  protected def serverOptions(using F: Sync[F]): Http4sServerOptions[F] = {
    val exceptionHandler = (e: String) => ValuedEndpointOutput(jsonBody[ErrorResponse.BadRequest], ErrorResponse.BadRequest(e))
    Http4sServerOptions.customiseInterceptors.defaultHandlers(exceptionHandler).options
  }

  protected val errorResponse =
    oneOf[ErrorResponse](
      oneOfVariant(StatusCode.UnprocessableEntity, jsonBody[ErrorResponse.UnprocessableEntity]),
      oneOfVariant(StatusCode.NotFound, jsonBody[ErrorResponse.NotFound]),
      oneOfVariant(StatusCode.InternalServerError, jsonBody[ErrorResponse.InternalError]),
      oneOfDefaultVariant(jsonBody[ErrorResponse.BadRequest])
    )

  def routes: HttpRoutes[F]

  extension[A] (fa: F[A])(using F: MonadThrow[F])
    def voidResponse: F[Either[ErrorResponse, Unit]] = mapResponse(_ => ())
    def mapResponse[B](fab: A => B): F[Either[ErrorResponse, B]] =
      fa
        .map(fab(_).asRight[ErrorResponse])
        .handleError(e => ErrorResponse.from(e).asLeft[B])
}
