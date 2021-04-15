package ebayapp.core.controllers

import java.time.{Instant, LocalDate, LocalDateTime, ZoneOffset}
import cats.effect._
import cats.implicits._
import ebayapp.core.common.config.SearchQuery
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.services.ResellableItemService
import ebayapp.core.common.{JsonCodecs, Logger}
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
      val localDate =
        if (dateString.length == 10) Try(LocalDate.parse(dateString)).map(_.atStartOfDay().toInstant(ZoneOffset.UTC))
        else if (dateString.length == 19) Try(LocalDateTime.parse(dateString)).map(_.toInstant(ZoneOffset.UTC))
        else Try(Instant.parse(dateString))
      localDate.toEither.leftMap(e => ParseFailure(s"Invalid date format: $dateString", e.getMessage))
    }

  implicit val searchQueryParamDecoder: QueryParamDecoder[SearchQuery] =
    QueryParamDecoder[String].map(SearchQuery.apply)

  object SearchQueryParam extends OptionalQueryParamDecoderMatcher[SearchQuery]("query")
  object LimitQueryParam  extends OptionalQueryParamDecoderMatcher[Int]("limit")
  object FromQueryParam   extends OptionalQueryParamDecoderMatcher[Instant]("from")
  object ToQueryParam     extends OptionalQueryParamDecoderMatcher[Instant]("to")

  def routes: HttpRoutes[F]

  protected def withErrorHandling(
      response: => F[Response[F]]
  )(implicit
      F: Sync[F],
      logger: Logger[F]
  ): F[Response[F]] =
    response.handleErrorWith {
      case error: MessageFailure =>
        logger.error(error)(s"error parsing json}") *>
          BadRequest(ErrorResponse(error.getMessage()).asJson)
      case error =>
        logger.error(error)(s"unexpected error") *>
          InternalServerError(ErrorResponse(error.getMessage).asJson)
    }

  protected def resellableItemsSummaryResponse[D <: ItemDetails](items: List[ResellableItem[D]]): ResellableItemsSummaryResponse = {
    val (worp, prof, rest) = items.foldLeft((List.empty[ResellableItem[D]], List.empty[ResellableItem[D]], List.empty[ResellableItem[D]])) {
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

  def home[F[_]: Sync: ContextShift](blocker: Blocker): F[Controller[F]] =
    Sync[F].pure(new HomeController[F](blocker))

  def videoGame[F[_]: Sync: Logger](service: ResellableItemService[F, ItemDetails.Game]): F[Controller[F]] =
    Sync[F].pure(new VideoGameController[F](service))

  def health[F[_]: Sync]: F[Controller[F]] =
    Sync[F].pure(new HealthController[F])
}
