package ebayapp.monitor

import cats.Monad
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import fs2.Stream

import scala.collection.mutable.ListBuffer

final private class MockActionDispatcher[F[_]](
    val submittedActions: ListBuffer[Action]
)(using
    F: Monad[F]
) extends ActionDispatcher[F]:

  override def dispatch(action: Action): F[Unit] = {
    submittedActions.addOne(action)
    F.unit
  }

  override def actions: fs2.Stream[F, Action] =
    Stream.emits(submittedActions)

object MockActionDispatcher {
  def make[F[_]: Monad] = new MockActionDispatcher[F](ListBuffer.empty)
}
