package ebayapp.core.controllers

import cats.Monad
import cats.effect._
import ebayapp.core.controllers.views._
import ebayapp.core.domain.ItemKind
import ebayapp.core.services.ResellableItemService
import io.circe.generic.auto._
import org.http4s.HttpRoutes
import sttp.model.StatusCode
import sttp.tapir.Codec.PlainCodec
import sttp.tapir.generic.SchemaDerivation
import sttp.tapir.json.circe.TapirJsonCirce
import sttp.tapir.server.http4s.Http4sServerOptions
import sttp.tapir.server.interceptor.ValuedEndpointOutput
import sttp.tapir.{Codec, DecodeResult, oneOf, oneOfDefaultVariant, oneOfVariant}

import java.time.{Instant, LocalDate, LocalDateTime, ZoneOffset}
import scala.util.Try

trait Controller[F[_]] extends TapirJsonCirce with SchemaDerivation {

  private def decodeInstant(dateString: String): DecodeResult[Instant] = {
    val localDate =
      if (dateString.length == 10) Try(LocalDate.parse(dateString)).map(_.atStartOfDay().toInstant(ZoneOffset.UTC))
      else if (dateString.length == 19) Try(LocalDateTime.parse(dateString)).map(_.toInstant(ZoneOffset.UTC))
      else Try(Instant.parse(dateString))
    localDate.fold(DecodeResult.Error(dateString, _), DecodeResult.Value.apply)
  }

  implicit val instantCodec: PlainCodec[Instant] = Codec.string.mapDecode(decodeInstant)(_.toString)

  protected def serverOptions(implicit F: Sync[F]): Http4sServerOptions[F, F] = Http4sServerOptions
    .customInterceptors[F, F]
    .errorOutput(e => ValuedEndpointOutput(jsonBody[ErrorResponse], ErrorResponse.BadRequest(e)))
    .options

  protected val errorResponse =
    oneOf[ErrorResponse](
      oneOfVariant(StatusCode.InternalServerError, jsonBody[ErrorResponse.InternalError]),
      oneOfDefaultVariant(jsonBody[ErrorResponse.BadRequest])
    )

  def routes: HttpRoutes[F]
}

object Controller {

  def home[F[_]: Sync]: F[Controller[F]] =
    Monad[F].pure(new HomeController[F])

  def videoGame[F[_]: Async](service: ResellableItemService[F]): F[Controller[F]] =
    Monad[F].pure(new ResellableItemController[F]("video-games", ItemKind.VideoGame, service))

  def health[F[_]: Async]: F[Controller[F]] =
    Monad[F].pure(new HealthController[F])
}
