package ebayapp.tasks

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.common.config.AppConfig
import ebayapp.domain.ItemDetails
import ebayapp.services.Services
import io.chrisdavenport.log4cats.Logger

final case class Tasks[F[_]: Concurrent](
    genericCexStockMonitor: CexStockMonitor[F, ItemDetails.Generic],
    videoGamesEbayDealsFinder: EbayDealsFinder[F, ItemDetails.Game]
) {
  def processes: fs2.Stream[F, Unit] = fs2.Stream(
    genericCexStockMonitor.monitorStock(),
//    videoGamesEbayDealsFinder.searchForCheapItems()
  ).covary[F].parJoinUnbounded
}

object Tasks {

  def make[F[_]: Concurrent: Logger: Timer](config: AppConfig, services: Services[F]): F[Tasks[F]] =
    (
      CexStockMonitor.generic(config.cex.stockMonitor, services),
      EbayDealsFinder.videoGames(config.ebay.deals.videoGames, services)
    ).mapN(Tasks.apply[F])
}
