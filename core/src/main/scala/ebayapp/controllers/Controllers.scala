package ebayapp.controllers

import cats.effect.{Blocker, ContextShift, Sync}
import cats.implicits._
import ebayapp.services.Services
import io.chrisdavenport.log4cats.Logger
import org.http4s.HttpRoutes
import org.http4s.server.Router

final case class Controllers[F[_]: Sync: Logger: ContextShift](
    home: Controller[F],
    videoGame: Controller[F]
) {

  def routes: HttpRoutes[F] =
    Router(
      "api" -> videoGame.routes,
      ""    -> home.routes
    )
}

object Controllers {

  def make[F[_]: Sync: Logger: ContextShift](blocker: Blocker, services: Services[F]): F[Controller[F]] =
    (
      Controller.home(blocker),
      Controller.videoGame(services.videoGame)
    ).mapN(Controllers.apply)
}
