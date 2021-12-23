package ebayapp.monitor.actions

import cats.Monad
import cats.effect.kernel.Concurrent
import cats.effect.std.Queue
import cats.syntax.functor._
import fs2.Stream

trait ActionDispatcher[F[_]]:
  def queue(action: Action): F[Unit]
  def actions: Stream[F, Action]

final private class LiveActionDispatcher[F[_]: Concurrent](
    private val actionsQueue: Queue[F, Action]
) extends ActionDispatcher[F]:
  def queue(action: Action): F[Unit] = actionsQueue.offer(action)
  def actions: Stream[F, Action]     = Stream.fromQueueUnterminated(actionsQueue)

object ActionDispatcher:
  def make[F[_]: Concurrent]: F[ActionDispatcher[F]] =
    Queue.unbounded[F, Action].map(q => LiveActionDispatcher(q))
