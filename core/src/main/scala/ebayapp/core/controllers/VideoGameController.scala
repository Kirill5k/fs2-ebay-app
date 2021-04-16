package ebayapp.core.controllers

import cats.MonadError
import cats.implicits._
import ebayapp.core.common.Logger
import ebayapp.core.controllers.VideoGameController.VideoGameResponse
import ebayapp.core.domain.ItemDetails
import ebayapp.core.domain.ResellableItem.VideoGame
import ebayapp.core.domain.search.ListingDetails
import ebayapp.core.services.ResellableItemService
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.HttpRoutes
import org.http4s.circe._

final private[controllers] class VideoGameController[F[_]: Logger](
    private val videoGameService: ResellableItemService[F, ItemDetails.Game]
)(implicit F: MonadError[F, Throwable]) extends Controller[F] {

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case GET -> Root / "video-games" :? LimitQueryParam(limit) +& FromQueryParam(from) +& ToQueryParam(to) +& SearchQueryParam(query) =>
        withErrorHandling {
          query
            .fold(videoGameService.findAll(limit, from, to))(q => videoGameService.findBy(q, limit, from, to))
            .flatMap(games => Ok(games.map(VideoGameResponse.from).asJson))
        }
      case GET -> Root / "video-games" / "stream" :? LimitQueryParam(limit) +& FromQueryParam(from) +& ToQueryParam(to) =>
        Ok {
          videoGameService
            .stream(limit, from, to)
            .map(VideoGameResponse.from)
            .map(_.asJson)
        }
      case GET -> Root / "video-games" / "summary" :? LimitQueryParam(limit) +& FromQueryParam(from) +& ToQueryParam(to) +& SearchQueryParam(query) =>
        withErrorHandling {
          query
            .fold(videoGameService.findAll(limit, from, to))(q => videoGameService.findBy(q, limit, from, to))
            .flatMap(games => Ok(resellableItemsSummaryResponse(games).asJson))
        }
    }
}

private[controllers] object VideoGameController {

  final case class ItemPrice(
      buy: BigDecimal,
      quantityAvailable: Int,
      sell: Option[BigDecimal],
      credit: Option[BigDecimal]
  )

  final case class VideoGameResponse(
      itemDetails: ItemDetails.Game,
      listingDetails: ListingDetails,
      price: ItemPrice
  )

  object VideoGameResponse {
    def from(game: VideoGame): VideoGameResponse =
      VideoGameResponse(
        game.itemDetails,
        game.listingDetails,
        ItemPrice(
          game.buyPrice.rrp,
          game.buyPrice.quantityAvailable,
          game.sellPrice.map(_.cash),
          game.sellPrice.map(_.credit)
        )
      )
  }
}
