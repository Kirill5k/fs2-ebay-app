package ebayapp.monitor.actions

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import ebayapp.kernel.errors.AppError
import ebayapp.monitor.domain.Monitor
import ebayapp.monitor.services.Services
import fs2.Stream
import org.typelevel.log4cats.Logger

import scala.concurrent.duration.*

trait ActionProcessor[F[_]]:
  def process: Stream[F, Unit]

final private class LiveActionProcessor[F[_]](
    private val dispatcher: ActionDispatcher[F],
    private val services: Services[F]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends ActionProcessor[F]:

  def process: Stream[F, Unit] =
    dispatcher.actions.map(a => Stream.eval(handleAction(a))).parJoinUnbounded

  private def handleAction(action: Action): F[Unit] =
    (action match
      case Action.RescheduleAll =>
        logger.info("rescheduling all monitors") >> services.monitor.rescheduleAll
      case Action.Schedule(monitor) =>
        services.monitoringEvent.schedule(monitor)
      case Action.Reschedule(id, interval) =>
        F.sleep(interval) >> services.monitor.reschedule(id)
      case Action.Query(monitor, previousEvent) =>
        logger.info(s"querying monitor ${monitor.id}-${monitor.name}") >> services.monitoringEvent.query(monitor, previousEvent)
      case Action.Notify(monitor, notification) =>
        logger.info(s"sending notification $notification for ${monitor.name}") >> services.notification.notify(monitor, notification)
    ).handleErrorWith {
      case error: AppError =>
        logger.warn(error)(s"domain error while processing action $action")
      case error =>
        logger.error(error)(s"unexpected error processing action $action") >>
          F.sleep(1.second) >>
          dispatcher.dispatch(action)
    }

object ActionProcessor:
  def make[F[_]: {Temporal, Logger}](dispatcher: ActionDispatcher[F], services: Services[F]): F[ActionProcessor[F]] =
    Monad[F].pure(LiveActionProcessor(dispatcher, services))
