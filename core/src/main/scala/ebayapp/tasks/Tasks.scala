package ebayapp.tasks

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.common.Logger
import ebayapp.common.config.AppConfig
import ebayapp.services.Services
import fs2.Stream

import scala.concurrent.duration._

final case class Tasks[F[_]: Concurrent: Logger: Timer](
    tasks: List[Task[F]]
) {
  def runAll: Stream[F, Unit] =
    Stream
      .emits(tasks)
      .map(_.run())
      .parJoinUnbounded
      .handleErrorWith { error =>
        Stream.eval_(Logger[F].critical(error)("error during task processing")) ++
          runAll.delayBy(1.minute)
      }
}

object Tasks {

  def make[F[_]: Concurrent: Logger: Timer](config: AppConfig, services: Services[F]): F[Tasks[F]] =
    List(
      CexStockMonitor.generic(config.cex.stockMonitor, services),
      EbayDealsFinder.videoGames(config.ebay.deals.videoGames, services),
      SelfridgesSaleMonitor.make(config.selfridges.stockMonitor, services),
      ErrorsNotifier.make[F](services)
    ).sequence.map(Tasks[F])
}
