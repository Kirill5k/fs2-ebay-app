package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.applicativeError.*
import cats.syntax.either.*
import cats.syntax.functor.*
import ebayapp.kernel.controllers.Controller
import ebayapp.kernel.controllers.views.ErrorResponse
import ebayapp.core.controllers.views.{ResellableItemView, ResellableItemsSummaryResponse}
import ebayapp.core.domain.{ItemDetails, ItemKind}
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

  given Schema[ItemKind] = Schema.string
  given Schema[ItemDetails] = Schema.string
  
  private val searchQueryParams =
    query[Option[Int]]("limit")
      .and(query[Option[String]]("query"))
      .and(query[Option[Instant]]("from"))
      .and(query[Option[Instant]]("to"))

  private val getAll = endpoint.get
    .in(basePath)
    .in(searchQueryParams)
    .errorOut(errorResponse)
    .out(jsonBody[List[ResellableItemView]])
    .serverLogic { (limit, query, from, to) =>
      itemService
        .search(SearchParams(itemKind, limit, from, to, query))
        .mapResponse(_.map(ResellableItemView.from))
    }

  private val getSummaries = endpoint.get
    .in(basePath / "summary")
    .in(searchQueryParams)
    .errorOut(errorResponse)
    .out(jsonBody[ResellableItemsSummaryResponse])
    .serverLogic { (limit, query, from, to) =>
      itemService
        .summaries(SearchParams(itemKind, limit, from, to, query))
        .mapResponse(ResellableItemsSummaryResponse.from)
    }

  override def routes: HttpRoutes[F] =
    Http4sServerInterpreter[F](serverOptions).toRoutes(List(getAll, getSummaries))
}

object ResellableItemController:
  def videoGame[F[_]: Async](service: ResellableItemService[F]): F[Controller[F]] =
    Monad[F].pure(ResellableItemController[F]("video-games", ItemKind.VideoGame, service))
