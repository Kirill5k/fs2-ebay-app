package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.functor.*
import ebayapp.kernel.controllers.Controller
import ebayapp.core.controllers.views.{ResellableItemView, ResellableItemsSummaryResponse}
import ebayapp.core.domain.{ItemDetails, ItemKind}
import ebayapp.core.repositories.SearchParams
import ebayapp.core.services.ResellableItemService
import ebayapp.kernel.controllers.views.ErrorResponse
import org.http4s.HttpRoutes
import sttp.tapir.*
import sttp.tapir.server.http4s.Http4sServerInterpreter

import java.time.Instant

final private[controllers] class ResellableItemController[F[_]](
    private val itemService: ResellableItemService[F]
)(using
    F: Async[F]
) extends Controller[F] {

  given Schema[ItemKind]    = Schema.string
  given Schema[ItemDetails] = Schema.string

  private val itemKindMappings = Map(
    "video-games" -> ItemKind.VideoGame
  )

  private val searchQueryParams =
    query[Option[Int]]("limit")
      .and(query[Option[String]]("query"))
      .and(query[Option[Instant]]("from"))
      .and(query[Option[Instant]]("to"))

  private def withItemKind[A](kind: String)(fa: ItemKind => F[Either[ErrorResponse, A]]): F[Either[ErrorResponse, A]] =
    itemKindMappings.get(kind) match
      case Some(itemKind) => fa(itemKind)
      case None           => F.pure(Left(ErrorResponse.NotFound(s"Unrecognized item kind $kind")))

  private val getAll = endpoint.get
    .in(path[String])
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[List[ResellableItemView]])
    .serverLogic { (kind, limit, query, from, to) =>
      withItemKind(kind) { itemKind =>
        itemService
          .search(SearchParams(itemKind, limit, from, to, query))
          .mapResponse(_.map(ResellableItemView.from))
      }
    }

  private val getSummaries = endpoint.get
    .in(path[String] / "summary")
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[ResellableItemsSummaryResponse])
    .serverLogic { (kind, limit, query, from, to) =>
      withItemKind(kind) { itemKind =>
        itemService
          .summaries(SearchParams(itemKind, limit, from, to, query))
          .mapResponse(ResellableItemsSummaryResponse.from)
      }
    }

  override def routes: HttpRoutes[F] =
    Http4sServerInterpreter[F](serverOptions).toRoutes(List(getAll, getSummaries))
}

object ResellableItemController:
  def make[F[_]: Async](service: ResellableItemService[F]): F[Controller[F]] =
    Monad[F].pure(ResellableItemController[F](service))
