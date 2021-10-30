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
      val filters = Filters(itemKind, limit, from, to)
      query
        .fold(itemService.findAll(filters))(q => itemService.findBy(q, filters))
        .map(_.map(ResellableItemResponse.from).asRight[ErrorResponse])
        .handleError(err => ErrorResponse.from(err).asLeft)
    }

  private val getSummaries = endpoint.get
    .in(basePath / "summary")
    .in(searchQueryParams)
    .errorOut(errorResponse)
    .out(jsonBody[ResellableItemsSummaryResponse])
    .serverLogic { case (limit, query, from, to) =>
      val filters = Filters(itemKind, limit, from, to)
      query
        .fold(itemService.findAll(filters))(q => itemService.findBy(q, filters))
        .map(resellableItemsSummaryResponse(_).asRight[ErrorResponse])
        .handleError(err => ErrorResponse.from(err).asLeft)
    }

  override def routes: HttpRoutes[F] =
    Http4sServerInterpreter[F](serverOptions).toRoutes(List(getAll, getSummaries))
}
