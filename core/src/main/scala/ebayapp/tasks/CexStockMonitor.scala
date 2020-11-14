package ebayapp.tasks

import cats.effect.{Sync, Timer}
import cats.implicits._
import ebayapp.common.config.CexStockMonitorConfig
import ebayapp.domain.ItemDetails
import ebayapp.services.{CexStockService, NotificationService, Services}
import io.chrisdavenport.log4cats.Logger

abstract class CexStockMonitor[F[_]: Sync: Logger: Timer, D <: ItemDetails] {

  protected def stockMonitorConfig: CexStockMonitorConfig

  protected def stockService: CexStockService[F]
  protected def notificationService: NotificationService[F]

  def monitorStock(): fs2.Stream[F, Unit] =
    stockService
      .stockUpdates(stockMonitorConfig)
      .evalMap(upd => upd.updates.traverse_(u => notificationService.stockUpdate(upd.item, u)))
}

object CexStockMonitor {

  def generic[F[_]: Sync: Logger: Timer](
      config: CexStockMonitorConfig,
      services: Services[F]
  ): F[CexStockMonitor[F, ItemDetails.Generic]] =
    Sync[F].delay {
      new CexStockMonitor[F, ItemDetails.Generic] {
        override protected def stockMonitorConfig: CexStockMonitorConfig   = config
        override protected def stockService: CexStockService[F]            = services.cexStock
        override protected def notificationService: NotificationService[F] = services.notification
      }
    }
}
