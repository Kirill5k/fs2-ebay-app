package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.apply.*
import cats.syntax.semigroupk.*
import ebayapp.kernel.controllers.{Controller, HealthController}
import ebayapp.core.services.Services
import org.http4s.HttpRoutes
import org.http4s.server.Router

trait Controllers[F[_]]:
  def home: Controller[F]
  def items: Controller[F]
  def health: Controller[F]
  def stock: Controller[F]
  def retailConfig: Controller[F]
  def routes(using M: Monad[F]): HttpRoutes[F] =
    Router(
      "api" -> (stock.routes <+> items.routes <+> retailConfig.routes),
      ""    -> (home.routes <+> health.routes)
    )

object Controllers {

  def make[F[_]: Async](services: Services[F]): F[Controllers[F]] =
    (
      HomeController.make[F],
      ResellableItemController.make(services.resellableItem),
      HealthController.make[F]("fs2-app-core"),
      StockController.make[F](services.stock),
      RetailConfigController.make[F](services.retailConfig)
    ).mapN((ho, it, he, st, rc) =>
      new Controllers[F] {
        def home: Controller[F]         = ho
        def items: Controller[F]        = it
        def health: Controller[F]       = he
        def stock: Controller[F]        = st
        def retailConfig: Controller[F] = rc
      }
    )
}
