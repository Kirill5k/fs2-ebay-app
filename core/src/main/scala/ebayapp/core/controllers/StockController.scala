package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.applicativeError.*
import cats.syntax.either.*
import cats.syntax.flatMap.*
import cats.syntax.traverse.*
import cats.syntax.functor.*
import ebayapp.core.clients.Retailer
import ebayapp.core.controllers.views.{ResellableItemView, ResellableItemsSummaryResponse}
import ebayapp.core.domain.{ItemDetails, ItemKind, ResellableItem}
import ebayapp.core.repositories.SearchParams
import ebayapp.core.services.{ResellableItemService, StockService}
import ebayapp.kernel.controllers.Controller
import ebayapp.kernel.controllers.views.ErrorResponse
import ebayapp.kernel.errors.AppError
import org.http4s.HttpRoutes
import sttp.model.StatusCode
import sttp.tapir.*
import sttp.tapir.server.http4s.Http4sServerInterpreter

import java.time.Instant

final private[controllers] class StockController[F[_]](
    private val stockServices: List[StockService[F]]
)(using
    F: Async[F]
) extends Controller[F] {

  given Schema[ItemKind]    = Schema.string
  given Schema[ItemDetails] = Schema.string

  private val basePath   = "stock"
  private val byRetailer = basePath / path[String]

  private val searchQueryParams =
    query[Option[String]]("query")

  private val getAll = endpoint.get
    .in(basePath)
    .in(searchQueryParams)
    .errorOut(errorResponse)
    .out(jsonBody[List[ResellableItemView]])
    .serverLogic { q =>
      stockServices
        .traverse(_.cachedItems)
        .map(_.flatten.toView(q).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val getByRetailer = endpoint.get
    .in(byRetailer)
    .in(searchQueryParams)
    .errorOut(errorResponse)
    .out(jsonBody[List[ResellableItemView]])
    .serverLogic { (retailer, q) =>
      serviceByRetailer(retailer)
        .flatMap(_.cachedItems)
        .map(_.toView(q).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val pauseRetailer = endpoint.put
    .in(byRetailer / "pause")
    .errorOut(errorResponse)
    .out(statusCode(StatusCode.NoContent))
    .serverLogic { retailer =>
      serviceByRetailer(retailer)
        .flatMap(_.pause)
        .map(_.asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val resumeRetailer = endpoint.put
    .in(byRetailer / "resume")
    .errorOut(errorResponse)
    .out(statusCode(StatusCode.NoContent))
    .serverLogic { retailer =>
      serviceByRetailer(retailer)
        .flatMap(_.resume)
        .map(_.asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
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

object StockController:
  def make[F[_]: Async](services: List[StockService[F]]): F[Controller[F]] =
    Monad[F].pure(StockController[F](services))
