package ebayapp.monitor.actions

import cats.effect.kernel.Concurrent
import cats.effect.std.Queue
import cats.syntax.functor.*
import fs2.Stream

trait ActionDispatcher[F[_]]:
  private[actions] def actions: Stream[F, Action]
  def dispatch(action: Action): F[Unit]

final private class LiveActionDispatcher[F[_]: Concurrent](
    private val actionsQueue: Queue[F, Action]
) extends ActionDispatcher[F]:
  private[actions] def actions: Stream[F, Action] = Stream.fromQueueUnterminated(actionsQueue)
  def dispatch(action: Action): F[Unit]           = actionsQueue.offer(action)

object ActionDispatcher:
  def make[F[_]: Concurrent]: F[ActionDispatcher[F]] =
    Queue.unbounded[F, Action].map(q => LiveActionDispatcher(q))
