package ebayapp.monitor.controllers

import cats.Monad
import cats.effect.Async
import cats.syntax.apply.*
import ebayapp.kernel.controllers.{Controller, HealthController}
import ebayapp.monitor.services.Services
import org.http4s.HttpRoutes
import org.http4s.server.Router
import org.typelevel.log4cats.Logger

trait Controllers[F[_]]:
  def monitor: Controller[F]
  def health: Controller[F]

  def routes(using M: Monad[F]): HttpRoutes[F] =
    Router("" -> health.routes, "api" -> monitor.routes)

object Controllers:
  def make[F[_]: Async: Logger](services: Services[F]): F[Controllers[F]] =
    (
      HealthController.make[F]("fs2-app-monitor"),
      MonitorController.make[F](services.monitor, services.monitoringEvent)
    ).mapN { (hc, mc) =>
      new Controllers[F]:
        def health: Controller[F]  = hc
        def monitor: Controller[F] = mc
    }
