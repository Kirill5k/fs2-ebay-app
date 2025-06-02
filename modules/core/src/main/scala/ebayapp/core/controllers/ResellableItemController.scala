package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import ebayapp.kernel.controllers.Controller
import ebayapp.core.controllers.views.{ResellableItemStats, ResellableItemView}
import ebayapp.core.domain.{ItemDetails, ItemKind, SearchParams}
import ebayapp.core.services.ResellableItemService
import org.http4s.HttpRoutes
import sttp.tapir.*
import sttp.tapir.generic.auto.SchemaDerivation
import sttp.tapir.json.circe.TapirJsonCirce

import java.time.Instant

final private[controllers] class ResellableItemController[F[_]](
    private val itemService: ResellableItemService[F]
)(using
    F: Async[F]
) extends Controller[F] {

  private val getAll = ResellableItemController.getAll
    .serverLogic { sp =>
      itemService
        .search(sp)
        .mapResponse(_.map(ResellableItemView.from))
    }

  override def routes: HttpRoutes[F] =
    serverInterpreter.toRoutes(List(getAll))
}

object ResellableItemController extends TapirJsonCirce with SchemaDerivation {
  import Controller.given

  given Schema[ItemDetails] = Schema.string

  private val basePath = "resellable-items"

  private val searchQueryParams: EndpointInput[SearchParams] =
    query[Option[ItemKind]]("kind")
      .and(query[Option[Int]]("skip"))
      .and(query[Option[Int]]("limit"))
      .and(query[Option[Instant]]("from"))
      .and(query[Option[Instant]]("to"))
      .and(query[Option[String]]("query"))
      .mapTo[SearchParams]

  val getAll = endpoint.get
    .in(basePath)
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[List[ResellableItemView]])

  val getStats = endpoint.get
    .in(basePath / "stats")
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[ResellableItemStats])

  def make[F[_]: Async](service: ResellableItemService[F]): F[Controller[F]] =
    Monad[F].pure(ResellableItemController[F](service))
}
