package ebayapp.core.controllers

import cats.effect.Async
import cats.syntax.applicativeError._
import cats.syntax.either._
import cats.syntax.functor._
import ebayapp.core.controllers.views.{ErrorResponse, ResellableItemResponse, ResellableItemsSummaryResponse}
import ebayapp.core.domain.ItemKind
import ebayapp.core.repositories.Filters
import ebayapp.core.services.ResellableItemService
import io.circe.generic.auto._
import org.http4s.HttpRoutes
import sttp.tapir._
import sttp.tapir.server.http4s.Http4sServerInterpreter

import java.time.Instant

final private[controllers] class VideoGameController[F[_]: Async](
    private val videoGameService: ResellableItemService[F]
) extends Controller[F] {

  private val basePath = "video-games"

  private val searchQueryParams =
    query[Option[Int]]("limit")
      .and(query[Option[String]]("query"))
      .and(query[Option[Instant]]("from"))
      .and(query[Option[Instant]]("to"))

  private val getAllGames = endpoint.get
    .in(basePath)
    .in(searchQueryParams)
    .errorOut(errorResponse)
    .out(jsonBody[List[ResellableItemResponse]])
    .serverLogic { case (limit, query, from, to) =>
      val filters = Filters(ItemKind.VideoGame, limit, from, to)
      query
        .fold(videoGameService.findAll(filters))(q => videoGameService.findBy(q, filters))
        .map(_.map(ResellableItemResponse.from).asRight[ErrorResponse])
        .handleError(err => ErrorResponse.from(err).asLeft)
    }

  private val getGamesSummaries = endpoint.get
    .in(basePath / "summary")
    .in(searchQueryParams)
    .errorOut(errorResponse)
    .out(jsonBody[ResellableItemsSummaryResponse])
    .serverLogic { case (limit, query, from, to) =>
      val filters = Filters(ItemKind.VideoGame, limit, from, to)
      query
        .fold(videoGameService.findAll(filters))(q => videoGameService.findBy(q, filters))
        .map(resellableItemsSummaryResponse(_).asRight[ErrorResponse])
        .handleError(err => ErrorResponse.from(err).asLeft)
    }

  override def routes: HttpRoutes[F] =
    Http4sServerInterpreter[F]().toRoutes(List(getAllGames, getGamesSummaries))
}
