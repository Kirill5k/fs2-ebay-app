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

  def routes(implicit M: Monad[F]): HttpRoutes[F] =
    Router(
      "api" -> videoGame.routes,
      ""    -> home.routes
    )
}

object Controllers {

  def make[F[_]: Sync: Logger: ContextShift](blocker: Blocker, services: Services[F]): F[Controllers[F]] =
    (
      Controller.home(blocker),
      Controller.videoGame(services.videoGame)
    ).mapN((h, v) =>
      new Controllers[F] {
        def home: Controller[F]      = h
        def videoGame: Controller[F] = v
      }
    )
}
