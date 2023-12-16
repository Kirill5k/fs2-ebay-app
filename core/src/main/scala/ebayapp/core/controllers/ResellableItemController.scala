package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.flatMap.*
import ebayapp.kernel.controllers.Controller
import ebayapp.core.controllers.views.{ResellableItemView, ResellableItemsSummaryResponse}
import ebayapp.core.domain.{ItemDetails, ItemKind}
import ebayapp.core.repositories.SearchParams
import ebayapp.core.services.ResellableItemService
import ebayapp.kernel.controllers.views.ErrorResponse
import org.http4s.HttpRoutes
import sttp.tapir.*
import sttp.tapir.Codec.PlainCodec
import sttp.tapir.generic.auto.SchemaDerivation
import sttp.tapir.json.circe.TapirJsonCirce

import java.time.Instant

final private[controllers] class ResellableItemController[F[_]](
    private val itemService: ResellableItemService[F]
)(using
    F: Async[F]
) extends Controller[F] {

  private val itemKindMappings = Map(
    "video-games" -> ItemKind.VideoGame
  )

  private def withItemKind[A](kind: String)(fa: ItemKind => F[Either[ErrorResponse, A]]): F[Either[ErrorResponse, A]] =
    itemKindMappings.get(kind) match
      case Some(itemKind) => fa(itemKind)
      case None           => F.pure(Left(ErrorResponse.NotFound(s"Unrecognized item kind $kind")))

  private def withItemKind[A](kind: Option[ItemKind])(fa: ItemKind => F[Either[ErrorResponse, A]]): F[Either[ErrorResponse, A]] =
    kind match
      case Some(value) => fa(value)
      case None => F.pure(Left(ErrorResponse.BadRequest("missing 'kind' request parameter")))

  private val getAll = ResellableItemController.getAll
    .serverLogic { (path, limit, query, from, to, kind) =>
      if (path == "resellable-items") {
        withItemKind(kind) { itemKind =>
          itemService
            .search(SearchParams(itemKind, limit, from, to, query))
            .mapResponse(_.map(ResellableItemView.from))
        }
      } else {
        withItemKind(path) { itemKind =>
          itemService
            .search(SearchParams(itemKind, limit, from, to, query))
            .mapResponse(_.map(ResellableItemView.from))
        }
      }
    }

  private val getSummaries = ResellableItemController.getSummaries
    .serverLogic { (path, limit, query, from, to, kind) =>
      if (path == "resellable-items") {
        withItemKind(kind) { itemKind =>
          itemService
            .summaries(SearchParams(itemKind, limit, from, to, query))
            .mapResponse(ResellableItemsSummaryResponse.from)
        }
      } else {
        withItemKind(path) { itemKind =>
          itemService
            .summaries(SearchParams(itemKind, limit, from, to, query))
            .mapResponse(ResellableItemsSummaryResponse.from)
        }
      }
    }

  override def routes: HttpRoutes[F] =
    serverInterpreter.toRoutes(List(getAll, getSummaries))
}

object ResellableItemController extends TapirJsonCirce with SchemaDerivation {
  import Controller.given

  given Schema[ItemDetails] = Schema.string

  private val searchQueryParams =
    query[Option[Int]]("limit")
      .and(query[Option[String]]("query"))
      .and(query[Option[Instant]]("from"))
      .and(query[Option[Instant]]("to"))
      .and(query[Option[ItemKind]]("kind"))

  val getAll = endpoint.get
    .in(path[String])
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[List[ResellableItemView]])

  val getSummaries = endpoint.get
    .in(path[String] / "summary")
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[ResellableItemsSummaryResponse])

  def make[F[_]: Async](service: ResellableItemService[F]): F[Controller[F]] =
    Monad[F].pure(ResellableItemController[F](service))
}
