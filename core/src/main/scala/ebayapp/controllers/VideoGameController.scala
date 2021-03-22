package ebayapp.controllers

import cats.effect.Sync
import cats.implicits._
import ebayapp.common.Logger
import ebayapp.controllers.VideoGameController.VideoGameResponse
import ebayapp.domain.ItemDetails
import ebayapp.domain.ResellableItem.VideoGame
import ebayapp.domain.search.ListingDetails
import ebayapp.services.ResellableItemService
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.HttpRoutes
import org.http4s.circe._

final private[controllers] class VideoGameController[F[_]: Sync: Logger](
    private val videoGameService: ResellableItemService[F, ItemDetails.Game]
) extends Controller[F] {

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
