package ebayapp.core.controllers

import cats.Monad
import cats.effect.{Sync}
import cats.implicits._
import ebayapp.core.services.Services
import ebayapp.core.common.Logger
import org.http4s.HttpRoutes
import org.http4s.server.Router

trait Controllers[F[_]] {
  def home: Controller[F]
  def videoGame: Controller[F]
  def health: Controller[F]

  def routes(implicit M: Monad[F]): HttpRoutes[F] =
    Router(
      "api" -> videoGame.routes,
      ""    -> {
        val homeRoutes = home.routes
        val healthRoutes = health.routes
        homeRoutes <+> healthRoutes
      }
    )
}

object Controllers {

  def make[F[_]: Sync: Logger](services: Services[F]): F[Controllers[F]] =
    (
      Controller.home,
      Controller.videoGame(services.videoGame),
      Controller.health
    ).mapN((ho, vg, he) =>
      new Controllers[F] {
        def home: Controller[F]      = ho
        def videoGame: Controller[F] = vg
        def health: Controller[F] = he
      }
    )
}
