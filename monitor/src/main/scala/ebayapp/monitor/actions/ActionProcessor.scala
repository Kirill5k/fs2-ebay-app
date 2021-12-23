package ebayapp.monitor.actions

import cats.Monad
import cats.effect.Temporal
import cats.effect.std.Queue
import fs2.Stream

trait ActionProcessor[F[_]]:
  def run: Stream[F, Unit]

final private class LiveActionProcessor[F[_]: Temporal](
    val actions: Queue[F, Action]
) extends ActionProcessor[F] {

  def run: Stream[F, Unit] = Stream.fromQueueUnterminated(actions).drain
}

object ActionProcessor:
  def make[F[_]: Temporal](actions: Queue[F, Action]): F[ActionProcessor[F]] =
    Monad[F].pure(LiveActionProcessor(actions))
