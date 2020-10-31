package ebayapp.controllers

import cats.effect.{ContextShift, Sync}
import cats.implicits._
import ebayapp.controllers.VideoGameController.VideoGameResponse
import ebayapp.domain.ItemDetails
import ebayapp.domain.ResellableItem.VideoGame
import ebayapp.domain.search.ListingDetails
import ebayapp.services.ResellableItemService
import io.chrisdavenport.log4cats.Logger
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.HttpRoutes
import org.http4s.circe._

final private[controllers] class VideoGameController[F[_]](
    private val videoGameService: ResellableItemService[F, ItemDetails.Game]
) extends Controller[F] {

  override def routes(implicit cs: ContextShift[F], s: Sync[F], l: Logger[F]): HttpRoutes[F] =
    HttpRoutes.of[F] {
      case GET -> Root / "video-games" :? LimitQueryParam(limit) +& FromQueryParam(from) +& ToQueryParam(to) =>
        withErrorHandling {
          for {
            games <- videoGameService.find(limit, from, to)
            resp  <- Ok(games.map(VideoGameResponse.from).asJson)
          } yield resp
        }
      case GET -> Root / "video-games" / "stream" :? LimitQueryParam(limit) +& FromQueryParam(from) +& ToQueryParam(to) =>
        Ok {
          videoGameService
            .stream(limit, from, to)
            .map(VideoGameResponse.from)
            .map(_.asJson)
        }
      case GET -> Root / "video-games" / "summary" :? LimitQueryParam(limit) +& FromQueryParam(from) +& ToQueryParam(to) =>
        withErrorHandling {
          for {
            games <- videoGameService.find(limit, from, to)
            resp  <- Ok(resellableItemsSummaryResponse(games).asJson)
          } yield resp
        }
    }
}

private[controllers] object VideoGameController {

  final case class ItemPrice(
      buy:  BigDecimal,
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
          game.buyPrice.value,
          game.buyPrice.quantityAvailable,
          game.sellPrice.map(_.cash),
          game.sellPrice.map(_.credit)
        )
      )
  }
}
