package ebayapp.core.controllers

import cats.{Monad, MonadError}

import java.time.{Instant, LocalDate, LocalDateTime, ZoneOffset}
import cats.effect._
import cats.syntax.either._
import cats.syntax.applicativeError._
import cats.syntax.apply._
import ebayapp.core.domain.ResellableItem
import ebayapp.core.services.ResellableItemService
import ebayapp.core.common.{JsonCodecs, Logger}
import ebayapp.core.controllers.views._
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.circe._
import org.http4s.dsl.Http4sDsl
import org.http4s.{HttpRoutes, MessageFailure, ParseFailure, QueryParamDecoder, Response}

import scala.util.Try

trait Controller[F[_]] extends Http4sDsl[F] with JsonCodecs {

  implicit val instantQueryParamDecoder: QueryParamDecoder[Instant] =
    QueryParamDecoder[String].emap { dateString =>
      val localDate =
        if (dateString.length == 10) Try(LocalDate.parse(dateString)).map(_.atStartOfDay().toInstant(ZoneOffset.UTC))
        else if (dateString.length == 19) Try(LocalDateTime.parse(dateString)).map(_.toInstant(ZoneOffset.UTC))
        else Try(Instant.parse(dateString))
      localDate.toEither.leftMap(e => ParseFailure(s"Invalid date format: $dateString", e.getMessage))
    }

  object SearchQueryParam extends OptionalQueryParamDecoderMatcher[String]("query")
  object LimitQueryParam  extends OptionalQueryParamDecoderMatcher[Int]("limit")
  object FromQueryParam   extends OptionalQueryParamDecoderMatcher[Instant]("from")
  object ToQueryParam     extends OptionalQueryParamDecoderMatcher[Instant]("to")

  def routes: HttpRoutes[F]

  protected def withErrorHandling(
      response: => F[Response[F]]
  )(implicit
      F: MonadError[F, Throwable],
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

  def videoGame[F[_]: Sync: Logger](service: ResellableItemService[F]): F[Controller[F]] =
    Monad[F].pure(new VideoGameController[F](service))

  def health[F[_]: Async]: F[Controller[F]] =
    Monad[F].pure(new HealthController[F])
}
