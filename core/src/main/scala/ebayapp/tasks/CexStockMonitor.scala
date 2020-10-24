package ebayapp.tasks

import cats.effect.{Sync, Timer}
import ebayapp.common.config.CexStockMonitorConfig
import ebayapp.domain.ItemDetails
import ebayapp.services.{CexStockService, NotificationService, Services}
import fs2.Stream
import io.chrisdavenport.log4cats.Logger

abstract class CexStockMonitor[F[_]: Sync: Logger: Timer, D <: ItemDetails] {

  protected def stockMonitorConfig: CexStockMonitorConfig

  protected def stockService: CexStockService[F, D]
  protected def notificationService: NotificationService[F]

  def monitorStock(): fs2.Stream[F, Unit] =
    fs2.Stream
      .emits(stockMonitorConfig.monitoringRequests)
      .evalMap(stockService.getUpdates)
      .flatMap(fs2.Stream.emits)
      .evalTap(notificationService.stockUpdate[D])
      .handleErrorWith { error =>
        Stream.eval(Logger[F].error(error)(s"error obtaining stock updates from cex")).drain
      }
      .drain
      .delayBy(stockMonitorConfig.monitoringFrequency)
      .repeat
}

object CexStockMonitor {

  def generic[F[_]: Sync: Logger: Timer](
      config: CexStockMonitorConfig,
      services: Services[F]
  ): F[CexStockMonitor[F, ItemDetails.Generic]] =
    Sync[F].delay {
      new CexStockMonitor[F, ItemDetails.Generic] {
        override protected def stockMonitorConfig: CexStockMonitorConfig             = config
        override protected def stockService: CexStockService[F, ItemDetails.Generic] = services.genericCexStockCheck
        override protected def notificationService: NotificationService[F]           = services.notification
      }
    }
}
