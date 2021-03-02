package ebayapp.controllers

import java.time.{Instant, LocalDate, ZoneOffset}
import cats.effect._
import cats.implicits._
import ebayapp.common.config.SearchQuery
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.services.ResellableItemService
import ebayapp.common.{JsonCodecs, Logger}
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.circe._
import org.http4s.dsl.Http4sDsl
import org.http4s.{HttpRoutes, MessageFailure, ParseFailure, QueryParamDecoder, Response}

import scala.util.Try

trait Controller[F[_]] extends Http4sDsl[F] with JsonCodecs {
  import Controller._

  implicit val instantQueryParamDecoder: QueryParamDecoder[Instant] =
    QueryParamDecoder[String].emap { dateString =>
      val date =
        if (dateString.length == 10) Try(LocalDate.parse(dateString)).map(_.atStartOfDay(ZoneOffset.UTC).toInstant)
        else Try(Instant.parse(dateString))
      date.toOption.toRight(ParseFailure(s"Invalid date format: $dateString", dateString))
    }

  implicit val searchQueryParamDecoder: QueryParamDecoder[SearchQuery] =
    QueryParamDecoder[String].map(SearchQuery.apply)

  object SearchQueryParam extends OptionalQueryParamDecoderMatcher[SearchQuery]("query")
  object LimitQueryParam extends OptionalQueryParamDecoderMatcher[Int]("limit")
  object FromQueryParam  extends OptionalQueryParamDecoderMatcher[Instant]("from")
  object ToQueryParam    extends OptionalQueryParamDecoderMatcher[Instant]("to")

  def routes(implicit cs: ContextShift[F], s: Sync[F], l: Logger[F]): HttpRoutes[F]

  protected def withErrorHandling(
      response: => F[Response[F]]
  )(
      implicit s: Sync[F],
      l: Logger[F]
  ): F[Response[F]] =
    response.handleErrorWith {
      case error: MessageFailure =>
        l.error(error)(s"error parsing json}") *>
          BadRequest(ErrorResponse(error.getMessage()).asJson)
      case error =>
        l.error(error)(s"unexpected error") *>
          InternalServerError(ErrorResponse(error.getMessage()).asJson)
    }

  protected def resellableItemsSummaryResponse[D <: ItemDetails](items: List[ResellableItem[D]]): ResellableItemsSummaryResponse = {
    val withoutResellPrice  = items.filter(_.sellPrice.isEmpty)
    val profitableForResell = items.filter(i => i.sellPrice.exists(rp => rp.cash > i.buyPrice.rrp))
    val rest                = items.filter(i => !withoutResellPrice.contains(i) && !profitableForResell.contains(i))
    ResellableItemsSummaryResponse(
      items.size,
      toItemsSummary(withoutResellPrice),
      toItemsSummary(profitableForResell),
      toItemsSummary(rest)
    )
  }

  private def toItemsSummary[D <: ItemDetails](items: List[ResellableItem[D]]): ItemsSummary =
    ItemsSummary(
      items.size,
      items.map { i =>
        ItemSummary(
          i.itemDetails.fullName,
          i.listingDetails.url,
          i.buyPrice.rrp,
          i.sellPrice.map(_.credit)
        )
      }
    )
}

object Controller {
  final case class ErrorResponse(message: String)

  final case class ItemSummary(
      name: Option[String],
      url: String,
      price: BigDecimal,
      exchange: Option[BigDecimal]
  )

  final case class ItemsSummary(
      total: Int,
      items: List[ItemSummary]
  )

  final case class ResellableItemsSummaryResponse(
      total: Int,
      unrecognized: ItemsSummary,
      profitable: ItemsSummary,
      rest: ItemsSummary
  )

  def home[F[_]: Sync](blocker: Blocker): F[Controller[F]] =
    Sync[F].delay(new HomeController[F](blocker))

  def videoGame[F[_]: Sync](service: ResellableItemService[F, ItemDetails.Game]): F[Controller[F]] =
    Sync[F].delay(new VideoGameController[F](service))
}
