package ebayapp.monitor.actions

import cats.Monad
import cats.effect.Temporal
import cats.effect.std.Queue
import ebayapp.monitor.services.Services
import fs2.Stream

trait ActionProcessor[F[_]]:
  def process: Stream[F, Unit]

final private class LiveActionProcessor[F[_]: Temporal](
    private val dispatcher: ActionDispatcher[F],
    private val services: Services[F]
) extends ActionProcessor[F] {

  def process: Stream[F, Unit] = dispatcher.actions.drain
}

object ActionProcessor:
  def make[F[_]: Temporal](dispatcher: ActionDispatcher[F], services: Services[F]): F[ActionProcessor[F]] =
    Monad[F].pure(LiveActionProcessor(dispatcher, services))
