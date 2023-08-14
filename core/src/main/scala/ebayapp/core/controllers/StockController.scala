package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.flatMap.*
import cats.syntax.traverse.*
import ebayapp.core.controllers.views.ResellableItemView
import ebayapp.core.domain.{ItemDetails, ItemKind, ResellableItem, Retailer}
import ebayapp.core.services.StockService
import ebayapp.kernel.controllers.Controller
import ebayapp.kernel.errors.AppError
import org.http4s.HttpRoutes
import sttp.model.StatusCode
import sttp.tapir.*
import sttp.tapir.generic.auto.SchemaDerivation
import sttp.tapir.json.circe.TapirJsonCirce
import sttp.tapir.server.http4s.Http4sServerInterpreter

import java.time.Instant

final private[controllers] class StockController[F[_]](
    private val stockServices: List[StockService[F]]
)(using
    F: Async[F]
) extends Controller[F] {

  private val getAll = StockController.getAll
    .serverLogic { q =>
      stockServices
        .traverse(_.cachedItems)
        .mapResponse(_.flatten.toView(q))
    }

  private val getByRetailer = StockController.getByRetailer
    .serverLogic { (retailer, q) =>
      serviceByRetailer(retailer)
        .flatMap(_.cachedItems)
        .mapResponse(_.toView(q))
    }

  private val pauseRetailer = StockController.pauseRetailer
    .serverLogic { retailer =>
      serviceByRetailer(retailer)
        .flatMap(_.pause)
        .voidResponse
    }

  private val resumeRetailer = StockController.resumeRetailer
    .serverLogic { retailer =>
      serviceByRetailer(retailer)
        .flatMap(_.resume)
        .voidResponse
    }

  extension (items: List[ResellableItem])
    def toView(q: Option[String]): List[ResellableItemView] =
      items
        .filter(i => i.itemDetails.fullName.exists(_.toLowerCase.contains(q.fold("")(_.toLowerCase))))
        .sortBy(i => (i.buyPrice.discount.getOrElse(0), i.itemDetails.fullName))(Ordering[(Int, Option[String])].reverse)
        .map(ResellableItemView.from)

  private def serviceByRetailer(retailer: String): F[StockService[F]] =
    F.fromEither(Retailer.from(retailer))
      .flatMap(r => F.fromOption(stockServices.find(_.retailer == r), AppError.Invalid(s"$r is not being monitored")))

  override def routes: HttpRoutes[F] =
    Http4sServerInterpreter[F](serverOptions).toRoutes(List(getAll, getByRetailer, pauseRetailer, resumeRetailer))
}

object StockController extends TapirJsonCirce with SchemaDerivation {
  given Schema[ItemKind]    = Schema.string
  given Schema[ItemDetails] = Schema.string

  private val basePath   = "stock"
  private val byRetailer = basePath / path[String]

  private val searchQueryParams =
    query[Option[String]]("query")

  val getAll = endpoint.get
    .in(basePath)
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[List[ResellableItemView]])

  val getByRetailer = endpoint.get
    .in(byRetailer)
    .in(searchQueryParams)
    .errorOut(Controller.errorResponse)
    .out(jsonBody[List[ResellableItemView]])

  val pauseRetailer = endpoint.put
    .in(byRetailer / "pause")
    .errorOut(Controller.errorResponse)
    .out(statusCode(StatusCode.NoContent))

  val resumeRetailer = endpoint.put
    .in(byRetailer / "resume")
    .errorOut(Controller.errorResponse)
    .out(statusCode(StatusCode.NoContent))

  def make[F[_]: Async](services: List[StockService[F]]): F[Controller[F]] =
    Monad[F].pure(StockController[F](services))
}
