package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.flatMap.*
import ebayapp.kernel.controllers.Controller
import ebayapp.core.controllers.views.{ResellableItemView, ResellableItemsSummaryResponse}
import ebayapp.core.domain.{ItemDetails, ItemKind}
import ebayapp.core.repositories.SearchParams
import ebayapp.core.services.ResellableItemService
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

  private val getAll = ResellableItemController.getAll
    .serverLogic { (limit, query, from, to, kind) =>
      itemService
        .search(SearchParams(kind, limit, from, to, query))
        .mapResponse(_.map(ResellableItemView.from))
    }

  private val getSummaries = ResellableItemController.getSummaries
    .serverLogic { (limit, query, from, to, kind) =>
      itemService
        .summaries(SearchParams(kind, limit, from, to, query))
        .mapResponse(ResellableItemsSummaryResponse.from)
    }

  override def routes: HttpRoutes[F] =
    serverInterpreter.toRoutes(List(getAll, getSummaries))
}

object ResellableItemController extends TapirJsonCirce with SchemaDerivation {
  import Controller.given

  given Schema[ItemDetails] = Schema.string

  private val basePath = "resellable-items"

  private val searchQueryParams =
    query[Option[Int]]("limit")
      .and(query[Option[String]]("query"))
      .and(query[Option[Instant]]("from"))
      .and(query[Option[Instant]]("to"))
      .and(query[Option[ItemKind]]("kind"))

  val getAll = endpoint.get
    .in(basePath)
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[List[ResellableItemView]])

  val getSummaries = endpoint.get
    .in(basePath / "summary")
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[ResellableItemsSummaryResponse])

  def make[F[_]: Async](service: ResellableItemService[F]): F[Controller[F]] =
    Monad[F].pure(ResellableItemController[F](service))
}
