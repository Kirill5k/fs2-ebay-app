package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.apply.*
import cats.syntax.semigroupk.*
import ebayapp.kernel.controllers.{Controller, HealthController}
import ebayapp.core.services.Services
import org.http4s.HttpRoutes
import org.http4s.server.Router

trait Controllers[F[_]] {
  def home: Controller[F]
  def videoGame: Controller[F]
  def health: Controller[F]
  def stock: Controller[F]

  def routes(using M: Monad[F]): HttpRoutes[F] =
    Router(
      "api" -> (videoGame.routes <+> stock.routes),
      ""    -> (home.routes <+> health.routes)
    )
}

object Controllers {

  def make[F[_]: Async](services: Services[F]): F[Controllers[F]] =
    (
      HomeController.make[F],
      ResellableItemController.videoGame(services.resellableItem),
      HealthController.make[F],
      StockController.make[F](services.stock)
    ).mapN((ho, vg, he, st) =>
      new Controllers[F] {
        def home: Controller[F]      = ho
        def videoGame: Controller[F] = vg
        def health: Controller[F]    = he
        def stock: Controller[F]     = st
      }
    )
}
