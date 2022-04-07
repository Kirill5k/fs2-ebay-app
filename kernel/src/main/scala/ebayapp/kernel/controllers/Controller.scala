package ebayapp.kernel.controllers

import cats.Monad
import cats.effect.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.kernel.common.time.*
import ebayapp.kernel.controllers.views.*
import org.http4s.HttpRoutes
import sttp.model.StatusCode
import sttp.tapir.Codec.PlainCodec
import sttp.tapir.generic.SchemaDerivation
import sttp.tapir.json.circe.TapirJsonCirce
import sttp.tapir.server.http4s.Http4sServerOptions
import sttp.tapir.server.interceptor.ValuedEndpointOutput
import sttp.tapir.{oneOf, oneOfDefaultVariant, oneOfVariant, Codec, DecodeResult}

import java.time.{Instant, LocalDate, LocalDateTime, ZoneOffset}
import scala.util.Try

trait Controller[F[_]] extends TapirJsonCirce with SchemaDerivation {

  inline given instantCodec: PlainCodec[Instant] =
    Codec.string.mapDecode(d => d.toInstant.fold(DecodeResult.Error(d, _), DecodeResult.Value(_)))(_.toString)

  protected def serverOptions(using F: Sync[F]): Http4sServerOptions[F, F] = Http4sServerOptions
    .customInterceptors[F, F]
    .errorOutput(e => ValuedEndpointOutput(jsonBody[ErrorResponse.BadRequest], ErrorResponse.BadRequest(e)))
    .options

  protected val errorResponse =
    oneOf[ErrorResponse](
      oneOfVariant(StatusCode.UnprocessableEntity, jsonBody[ErrorResponse.UnprocessableEntity]),
      oneOfVariant(StatusCode.NotFound, jsonBody[ErrorResponse.NotFound]),
      oneOfVariant(StatusCode.InternalServerError, jsonBody[ErrorResponse.InternalError]),
      oneOfDefaultVariant(jsonBody[ErrorResponse.BadRequest])
    )

  def routes: HttpRoutes[F]
}
