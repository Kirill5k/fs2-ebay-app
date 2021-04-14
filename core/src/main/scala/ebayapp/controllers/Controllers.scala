package ebayapp.controllers

import cats.Monad
import cats.effect.{Blocker, ContextShift, Sync}
import cats.implicits._
import ebayapp.services.Services
import ebayapp.common.Logger
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

  def make[F[_]: Sync: Logger: ContextShift](blocker: Blocker, services: Services[F]): F[Controllers[F]] =
    (
      Controller.home(blocker),
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
