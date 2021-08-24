package ebayapp.core.tasks

import cats.effect.Temporal
import cats.syntax.functor._
import cats.syntax.traverse._
import ebayapp.core.common.Logger
import ebayapp.core.services.Services
import fs2.Stream

import scala.concurrent.duration._

final class Tasks[F[_]: Temporal: Logger](
    val tasks: List[Task[F]]
) {
  def runAll: Stream[F, Unit] =
    Stream
      .emits(tasks)
      .map(_.run().resumeOnError(1.minute))
      .parJoinUnbounded

  implicit final private class StreamOps[O](private val stream: Stream[F, O]) {
    def resumeOnError(delay: FiniteDuration)(implicit logger: Logger[F]): Stream[F, O] =
      stream.handleErrorWith { error =>
        Stream.eval(logger.error(error)("error during task processing")).drain ++
          stream.delayBy[F](delay)
      }
  }
}

object Tasks {

  def make[F[_]: Temporal: Logger](services: Services[F]): F[Tasks[F]] =
    List(
      ErrorsNotifier.make[F](services),
      DealsFinder.make[F](services),
      StockMonitor.make[F](services)
    ).sequence.map(tasks => new Tasks[F](tasks))
}
