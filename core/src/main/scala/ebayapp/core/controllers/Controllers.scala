package ebayapp.core.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.apply.*
import cats.syntax.semigroupk.*
import ebayapp.core.services.Services
import org.http4s.HttpRoutes
import org.http4s.server.Router

trait Controllers[F[_]] {
  def home: Controller[F]
  def videoGame: Controller[F]
  def health: Controller[F]

  def routes(implicit M: Monad[F]): HttpRoutes[F] =
    Router(
      "api" -> videoGame.routes,
      "" -> {
        val homeRoutes   = home.routes
        val healthRoutes = health.routes
        homeRoutes <+> healthRoutes
      }
    )
}

object Controllers {

  def make[F[_]: Async](services: Services[F]): F[Controllers[F]] =
    (
      Controller.home,
      Controller.videoGame(services.resellableItem),
      Controller.health
    ).mapN((ho, vg, he) =>
      new Controllers[F] {
        def home: Controller[F]      = ho
        def videoGame: Controller[F] = vg
        def health: Controller[F]    = he
      }
    )
}
