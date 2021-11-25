package ebayapp.core.controllers

import cats.effect.Async
import cats.syntax.applicativeError.*
import cats.syntax.either.*
import cats.syntax.functor.*
import ebayapp.core.controllers.views.{ErrorResponse, ResellableItemResponse, ResellableItemsSummaryResponse}
import ebayapp.core.domain.ItemKind
import ebayapp.core.repositories.SearchParams
import ebayapp.core.services.ResellableItemService
import org.http4s.HttpRoutes
import sttp.tapir.*
import sttp.tapir.server.http4s.Http4sServerInterpreter

import java.time.Instant

final private[controllers] class ResellableItemController[F[_]: Async](
    private val basePath: String,
    private val itemKind: ItemKind,
    private val itemService: ResellableItemService[F]
) extends Controller[F] {

  private val searchQueryParams =
    query[Option[Int]]("limit")
      .and(query[Option[String]]("query"))
      .and(query[Option[Instant]]("from"))
      .and(query[Option[Instant]]("to"))

  private val getAll = endpoint.get
    .in(basePath)
    .in(searchQueryParams)
    .errorOut(errorResponse)
    .out(jsonBody[List[ResellableItemResponse]])
    .serverLogic { case (limit, query, from, to) =>
      itemService.search(SearchParams(itemKind, limit, from, to, query))
        .map(_.map(ResellableItemResponse.from).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val getSummaries = endpoint.get
    .in(basePath / "summary")
    .in(searchQueryParams)
    .errorOut(errorResponse)
    .out(jsonBody[ResellableItemsSummaryResponse])
    .serverLogic { case (limit, query, from, to) =>
      itemService.summaries(SearchParams(itemKind, limit, from, to, query))
        .map(ResellableItemsSummaryResponse.from(_).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  override def routes: HttpRoutes[F] =
    Http4sServerInterpreter[F](serverOptions).toRoutes(List(getAll, getSummaries))
}
