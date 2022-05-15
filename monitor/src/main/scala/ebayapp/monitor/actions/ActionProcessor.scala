package ebayapp.monitor.actions

import cats.{Monad, Parallel}
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.parallel.*
import cats.syntax.applicativeError.*
import ebayapp.kernel.errors.AppError
import ebayapp.monitor.domain.Monitor
import ebayapp.monitor.services.Services
import fs2.Stream
import org.typelevel.log4cats.Logger

import scala.concurrent.duration.*

trait ActionProcessor[F[_]]:
  def process: Stream[F, Unit]

final private class LiveActionProcessor[F[_]: Parallel](
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
      case Action.EnqueueAll =>
        services.monitor.getAllActive.flatMap(_.parTraverse_(enqueueWithEventFetched))
      case Action.EnqueueNew(monitor) =>
        services.monitoringEvent.process(monitor, None)
      case Action.Enqueue(monitor, prevEvent) =>
        services.monitoringEvent.process(monitor, Some(prevEvent))
      case Action.Requeue(id, interval, prevEvent) =>
        F.sleep(interval) >> services.monitor.find(id).flatMap {
          case Some(monitor) => services.monitoringEvent.process(monitor, Some(prevEvent))
          case None          => logger.warn(s"monitor $id does not exist")
        }
      case Action.Notify(monitor, notification) =>
        services.notification.notify(monitor, notification)
    ).handleErrorWith {
      case error: AppError =>
        logger.warn(error)(s"domain error while processing action $action")
      case error =>
        logger.error(error)(s"unexpected error processing action $action") >>
          F.sleep(1.second) >>
          dispatcher.dispatch(action)
    }

  private def enqueueWithEventFetched(monitor: Monitor): F[Unit] =
    services.monitoringEvent
      .findLatest(monitor.id)
      .flatMap(e => services.monitoringEvent.process(monitor, e))

object ActionProcessor:
  def make[F[_]: Temporal: Logger: Parallel](dispatcher: ActionDispatcher[F], services: Services[F]): F[ActionProcessor[F]] =
    Monad[F].pure(LiveActionProcessor(dispatcher, services))
