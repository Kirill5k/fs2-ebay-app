package ebayapp.monitor.controllers

import cats.Monad
import cats.effect.Async
import ebayapp.kernel.controllers.Controller
import ebayapp.monitor.services.{MonitorService, MonitoringEventService}
import org.http4s.HttpRoutes
import org.typelevel.log4cats.Logger

final private class LiveMonitorController[F[_]](
    private val monitorService: MonitorService[F],
    private val monitoringEventService: MonitoringEventService[F]
)(using
    F: Async[F],
    logger: Logger[F]
) extends Controller[F]:
  def routes: HttpRoutes[F] = ???

object MonitorController:
  def make[F[_]: Async: Logger](monitorService: MonitorService[F], monitoringEventService: MonitoringEventService[F]): F[Controller[F]] =
    Monad[F].pure(LiveMonitorController[F](monitorService, monitoringEventService))
