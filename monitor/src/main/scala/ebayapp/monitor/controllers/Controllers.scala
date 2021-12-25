package ebayapp.monitor.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.functor.*
import ebayapp.kernel.controllers.{Controller, HealthController}
import org.http4s.HttpRoutes
import org.http4s.server.Router

trait Controllers[F[_]]:
  def health: Controller[F]

  def routes(using M: Monad[F]): HttpRoutes[F] =
    Router(
      "" -> (health.routes)
    )

object Controllers:

  def make[F[_]: Async]: F[Controllers[F]] =
    HealthController.make[F].map { hc =>
      new Controllers[F] {
        def health: Controller[F] = hc
      }
    }
