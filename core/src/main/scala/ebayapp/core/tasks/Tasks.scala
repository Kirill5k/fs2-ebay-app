package ebayapp.core.tasks

import cats.effect.Temporal
import cats.syntax.functor.*
import cats.syntax.traverse.*
import ebayapp.core.common.Logger
import ebayapp.core.common.stream.*
import ebayapp.core.services.Services
import fs2.Stream

import scala.concurrent.duration.*

final class Tasks[F[_]: Temporal: Logger](
    private val tasks: List[Task[F]]
) {
  def runAll: Stream[F, Unit] =
    Stream
      .emits(tasks)
      .map(_.run.resumeOnError(1.minute))
      .parJoinUnbounded

  extension [O](stream: Stream[F, O])
    def resumeOnError(delay: FiniteDuration)(using logger: Logger[F]): Stream[F, O] =
      stream.handleErrorWith { error =>
        Stream.logError(error)("error during task processing") ++
          stream.delayBy[F](delay)
      }
}

object Tasks {

  def make[F[_]: Temporal: Logger](services: Services[F]): F[Tasks[F]] =
    List(
      ErrorsNotifier.make[F](services),
      DealsFinder.make[F](services),
      StockMonitor.make[F](services)
    ).sequence.map(tasks => Tasks[F](tasks))
}
