package ebayapp.core.controllers

import cats.Monad
import cats.effect._
import ebayapp.core.controllers.views._
import ebayapp.core.domain.ResellableItem
import ebayapp.core.services.ResellableItemService
import io.circe.generic.auto._
import org.http4s.HttpRoutes
import sttp.model.StatusCode
import sttp.tapir.Codec.PlainCodec
import sttp.tapir.generic.SchemaDerivation
import sttp.tapir.json.circe.TapirJsonCirce
import sttp.tapir.server.http4s.Http4sServerOptions
import sttp.tapir.server.interceptor.ValuedEndpointOutput
import sttp.tapir.{Codec, DecodeResult, oneOf, oneOfDefaultMapping, oneOfMapping}

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
      oneOfMapping(StatusCode.InternalServerError, jsonBody[ErrorResponse.InternalError]),
      oneOfDefaultMapping(jsonBody[ErrorResponse.BadRequest])
    )

  def routes: HttpRoutes[F]

  protected def resellableItemsSummaryResponse(items: List[ResellableItem]): ResellableItemsSummaryResponse = {
    val (worp, prof, rest) = items.foldLeft((List.empty[ResellableItem], List.empty[ResellableItem], List.empty[ResellableItem])) {
      case ((withoutResell, profitable, rest), item) =>
        if (item.sellPrice.isEmpty) (item :: withoutResell, profitable, rest)
        else if (item.sellPrice.exists(rp => rp.cash > item.buyPrice.rrp)) (withoutResell, item :: profitable, rest)
        else (withoutResell, profitable, item :: rest)
    }

    ResellableItemsSummaryResponse(
      items.size,
      toItemsSummary(worp.reverse),
      toItemsSummary(prof.reverse),
      toItemsSummary(rest.reverse)
    )
  }

  private def toItemsSummary(items: List[ResellableItem]): ItemsSummary =
    ItemsSummary(
      items.size,
      items.map { i =>
        ItemSummary(
          i.itemDetails.fullName,
          i.listingDetails.title,
          i.listingDetails.url,
          i.buyPrice.rrp,
          i.sellPrice.map(_.credit)
        )
      }
    )
}

object Controller {

  def home[F[_]: Sync]: F[Controller[F]] =
    Monad[F].pure(new HomeController[F])

  def videoGame[F[_]: Async](service: ResellableItemService[F]): F[Controller[F]] =
    Monad[F].pure(new VideoGameController[F](service))

  def health[F[_]: Async]: F[Controller[F]] =
    Monad[F].pure(new HealthController[F])
}
