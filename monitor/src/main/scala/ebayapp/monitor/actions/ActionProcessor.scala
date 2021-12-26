package ebayapp.monitor.actions

import cats.Monad
import cats.effect.Temporal
import cats.effect.std.Queue
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import ebayapp.monitor.services.Services
import fs2.Stream
import org.typelevel.log4cats.Logger

trait ActionProcessor[F[_]]:
  def process: Stream[F, Unit]

final private class LiveActionProcessor[F[_]](
    private val dispatcher: ActionDispatcher[F],
    private val services: Services[F]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends ActionProcessor[F]:
  private val maxConcurrent: Int = 1024

  def process: Stream[F, Unit] =
    dispatcher.actions
      .map {
        case Action.Notify(monitor, notification) => Stream.eval(services.notify(monitor, notification))
        case Action.EnqueueNew(monitor)           => Stream.eval(services.enqueue(monitor, None))
        case Action.Enqueue(monitor, prevEvent)   => Stream.eval(services.enqueue(monitor, Some(prevEvent)))
        case Action.EnqueueAll =>
          Stream
            .evalSeq(services.monitor.getAllActive)
            .mapAsync(maxConcurrent)(enqueueWithEventFetched)
        case Action.Requeue(id, interval, prevEvent) =>
          Stream
            .eval(services.monitor.find(id))
            .delayBy(interval)
            .evalMap {
              case Some(monitor) => services.enqueue(monitor, Some(prevEvent))
              case None          => logger.warn(s"monitor $id does not exist")
            }
      }
      .parJoinUnbounded
      .handleErrorWith(e => Stream.eval(logger.error(e)("error during action processing")) ++ process)

  private def enqueueWithEventFetched(monitor: Monitor): F[Unit] =
    services.monitoringEvent
      .findLatestEvent(monitor.id)
      .flatMap(e => services.monitoringEvent.enqueue(monitor, e))

object ActionProcessor:
  def make[F[_]: Temporal: Logger](dispatcher: ActionDispatcher[F], services: Services[F]): F[ActionProcessor[F]] =
    Monad[F].pure(LiveActionProcessor(dispatcher, services))
