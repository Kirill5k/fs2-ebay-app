package ebayapp.tasks

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.common.config.AppConfig
import ebayapp.domain.ItemDetails
import ebayapp.services.Services
import io.chrisdavenport.log4cats.Logger
import fs2.Stream

import scala.concurrent.duration._

final case class Tasks[F[_]: Concurrent: Logger: Timer](
    genericCexStockMonitor: CexStockMonitor[F, ItemDetails.Generic],
    videoGamesEbayDealsFinder: EbayDealsFinder[F, ItemDetails.Game],
    selfridgesSaleMonitor: SelfridgesSaleMonitor[F]
) {
  def processes: Stream[F, Unit] =
    Stream(
      genericCexStockMonitor.monitorStock(),
      videoGamesEbayDealsFinder.searchForCheapItems(),
      selfridgesSaleMonitor.monitorSale()
    ).covary[F]
      .parJoinUnbounded
      .handleErrorWith { error =>
        Stream.eval_(Logger[F].error(error)("error during task processing")) ++
          Stream.sleep_(1.minute) ++
          processes
      }
}

object Tasks {

  def make[F[_]: Concurrent: Logger: Timer](config: AppConfig, services: Services[F]): F[Tasks[F]] =
    (
      CexStockMonitor.generic(config.cex.stockMonitor, services),
      EbayDealsFinder.videoGames(config.ebay.deals.videoGames, services),
      SelfridgesSaleMonitor.make(config.selfridges.stockMonitor, services)
    ).mapN(Tasks.apply[F])
}
