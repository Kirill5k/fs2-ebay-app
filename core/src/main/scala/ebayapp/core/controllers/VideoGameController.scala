package ebayapp.core.controllers

import cats.MonadError
import cats.syntax.flatMap._
import ebayapp.core.common.Logger
import ebayapp.core.controllers.views.ResellableItemResponse
import ebayapp.core.domain.ItemKind
import ebayapp.core.repositories.Filters
import ebayapp.core.services.ResellableItemService
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec._

final private[controllers] class VideoGameController[F[_]: Logger](
    private val videoGameService: ResellableItemService[F]
)(implicit F: MonadError[F, Throwable])
    extends Controller[F] {

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case GET -> Root / "video-games" :? LimitQueryParam(limit) +& FromQueryParam(from) +& ToQueryParam(to) +& SearchQueryParam(query) =>
        withErrorHandling {
          val filters = Filters(ItemKind.VideoGame, limit, from, to)
          query
            .fold(videoGameService.findAll(filters))(q => videoGameService.findBy(q, filters))
            .flatMap(games => Ok(games.map(ResellableItemResponse.from).asJson))
        }
      case GET -> Root / "video-games" / "stream" :? LimitQueryParam(limit) +& FromQueryParam(from) +& ToQueryParam(to) =>
        Ok {
          videoGameService
            .stream(Filters(ItemKind.VideoGame, limit, from, to))
            .map(ResellableItemResponse.from)
            .map(_.asJson)
        }
      case GET -> Root / "video-games" / "summary" :? LimitQueryParam(limit) +& FromQueryParam(from) +& ToQueryParam(to) +& SearchQueryParam(query) =>
        withErrorHandling {
          val filters = Filters(ItemKind.VideoGame, limit, from, to)
          query
            .fold(videoGameService.findAll(filters))(q => videoGameService.findBy(q, filters))
            .flatMap(games => Ok(resellableItemsSummaryResponse(games).asJson))
        }
    }
}
