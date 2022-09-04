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
import ebayapp.core.domain.{ItemDetails, ItemKind}
import ebayapp.core.repositories.SearchParams
import ebayapp.core.services.{ResellableItemService, StockService}
import ebayapp.kernel.controllers.Controller
import ebayapp.kernel.controllers.views.ErrorResponse
import ebayapp.kernel.errors.AppError
import org.http4s.HttpRoutes
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

  private val getAll = endpoint.get
    .in(basePath)
    .errorOut(errorResponse)
    .out(jsonBody[List[ResellableItemView]])
    .serverLogic { _ =>
      stockServices
        .traverse(_.cachedItems)
        .map(_.flatten.map(ResellableItemView.from).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  private val getByRetailer = endpoint.get
    .in(byRetailer)
    .errorOut(errorResponse)
    .out(jsonBody[List[ResellableItemView]])
    .serverLogic { retailer =>
      F
        .fromEither(Retailer.from(retailer))
        .map(r => stockServices.filter(_.retailer == r))
        .flatMap(_.traverse(_.cachedItems))
        .map(_.flatten.map(ResellableItemView.from).asRight[ErrorResponse])
        .handleError(ErrorResponse.from(_).asLeft)
    }

  override def routes: HttpRoutes[F] =
    Http4sServerInterpreter[F](serverOptions).toRoutes(List(getAll, getByRetailer))
}

object StockController:
  def make[F[_]: Async](services: List[StockService[F]]): F[Controller[F]] =
    Monad[F].pure(StockController[F](services))
