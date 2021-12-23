package ebayapp.monitor.actions

import cats.effect.std.Queue
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*

trait Actions[F[_]]:
  def dispatcher: ActionDispatcher[F]
  def processor: ActionProcessor[F]

object Actions:
  def make[F[_]: Temporal] =
    for
      acts <- Queue.unbounded[F, Action]
      disp <- ActionDispatcher.make(acts)
      proc <- ActionProcessor.make(acts)
    yield new Actions[F] {
      def dispatcher: ActionDispatcher[F] = disp
      def processor: ActionProcessor[F]   = proc
    }
