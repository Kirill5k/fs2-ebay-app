package ebayapp.monitor.actions

import cats.Monad
import cats.effect.Temporal
import cats.effect.std.Queue
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import ebayapp.monitor.services.Services
import fs2.Stream

trait ActionProcessor[F[_]]:
  def process: Stream[F, Unit]

final private class LiveActionProcessor[F[_]](
    private val dispatcher: ActionDispatcher[F],
    private val services: Services[F]
)(using
    F: Temporal[F]
) extends ActionProcessor[F] {

  private val maxConcurrent: Int = 1024

  def process: Stream[F, Unit] =
    dispatcher.actions
      .mapAsync(maxConcurrent) {
        case Action.EnqueueNew(monitor)         => enqueueNew(monitor)
        case Action.Enqueue(monitor, prevEvent) => enqueue(prevEvent)(monitor)
        case Action.EnqueueAll =>
          for
            monitors <- services.monitor.getAllActive
            _        <- F.parTraverseN(maxConcurrent)(monitors)(enqueueWithEventFetched)
          yield ()
        case Action.Requeue(id, interval, prevEvent) =>
          for
            monitor <- F.sleep(interval) >> services.monitor.find(id)
            _       <- monitor.fold(F.unit)(enqueue(prevEvent))
          yield ()
      }

  private def enqueueWithEventFetched(monitor: Monitor): F[Unit] =
    services.monitoringEvent.findLatestEvent(monitor.id).flatMap(e => services.monitoringEvent.enqueue(monitor, e))

  private def enqueueNew(monitor: Monitor): F[Unit] =
    services.monitoringEvent.enqueue(monitor, None)

  private def enqueue(prevEvent: MonitoringEvent)(monitor: Monitor): F[Unit] =
    services.monitoringEvent.enqueue(monitor, Some(prevEvent))
}

object ActionProcessor:
  def make[F[_]: Temporal](dispatcher: ActionDispatcher[F], services: Services[F]): F[ActionProcessor[F]] =
    Monad[F].pure(LiveActionProcessor(dispatcher, services))
