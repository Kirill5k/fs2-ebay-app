package ebayapp.core.tasks

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.core.common.Logger
import ebayapp.core.common.config.AppConfig
import ebayapp.core.services.Services
import fs2.Stream

import scala.concurrent.duration._

final class Tasks[F[_]: Concurrent: Logger: Timer](
    val tasks: List[Task[F]]
) {
  def runAll: Stream[F, Unit] =
    Stream
      .emits(tasks)
      .map(_.run().resumeOnError(1.minute))
      .parJoinUnbounded

  implicit final private class StreamOps[O](private val stream: Stream[F, O]) {
    def resumeOnError(delay: FiniteDuration)(implicit logger: Logger[F], timer: Timer[F]): Stream[F, O] =
      stream.handleErrorWith { error =>
        Stream.eval_(logger.error(error)("error during task processing")) ++
          stream.delayBy(delay)(timer)
      }
  }
}

object Tasks {

  def make[F[_]: Concurrent: Logger: Timer](config: AppConfig, services: Services[F]): F[Tasks[F]] =
    List(
      ErrorsNotifier.make[F](services),
      EbayDealsFinder.videoGames[F](config.ebay.deals.videoGames, services),
      StockMonitor.make[F](config, services)
    ).sequence.map(tasks => new Tasks[F](tasks))
}
