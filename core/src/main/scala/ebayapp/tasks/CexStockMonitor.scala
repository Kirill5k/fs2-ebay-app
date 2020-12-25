package ebayapp.tasks

import cats.effect.Sync
import cats.implicits._
import ebayapp.clients.cex.mappers._
import ebayapp.common.config.CexStockMonitorConfig
import ebayapp.domain.ItemDetails
import ebayapp.services.{CexStockService, NotificationService, Services}
import fs2.Stream

final class CexStockMonitor[F[_]: Sync, D <: ItemDetails: CexItemMapper](
    private val stockMonitorConfig: CexStockMonitorConfig,
    private val stockService: CexStockService[F],
    private val notificationService: NotificationService[F]
) {

  def monitorStock(): Stream[F, Unit] =
    stockService
      .stockUpdates[D](stockMonitorConfig)
      .evalMap(upd => upd.updates.traverse_(u => notificationService.stockUpdate(upd.item, u)))
}

object CexStockMonitor {

  def generic[F[_]: Sync](
      config: CexStockMonitorConfig,
      services: Services[F]
  ): F[CexStockMonitor[F, ItemDetails.Generic]] =
    Sync[F].delay {
      new CexStockMonitor[F, ItemDetails.Generic](
        config,
        services.cexStock,
        services.notification
      )(
        Sync[F],
        genericItemMapper
      )
    }
}
