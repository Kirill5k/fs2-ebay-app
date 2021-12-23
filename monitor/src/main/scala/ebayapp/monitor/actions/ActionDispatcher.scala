package ebayapp.monitor.actions

import cats.Monad
import cats.effect.std.Queue

trait ActionDispatcher[F[_]]:
  def queue(action: Action): F[Unit]

final private class LiveActionDispatcher[F[_]](
    val actions: Queue[F, Action]
) extends ActionDispatcher[F]:
  def queue(action: Action): F[Unit] = actions.offer(action)

object ActionDispatcher:
  def make[F[_]: Monad](actions: Queue[F, Action]): F[ActionDispatcher[F]] =
    Monad[F].pure(LiveActionDispatcher(actions))
