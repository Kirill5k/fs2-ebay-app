package ebayapp.tasks

import cats.effect.Sync
import cats.implicits._
import ebayapp.clients.cex.mappers._
import ebayapp.clients.cex.responses.CexItem
import ebayapp.common.config.StockMonitorConfig
import ebayapp.domain.ItemDetails
import ebayapp.services.{NotificationService, Services, StockService}
import fs2.Stream

final class CexStockMonitor[F[_]: Sync, D <: ItemDetails: CexItemMapper](
    private val stockMonitorConfig: StockMonitorConfig,
    private val stockService: StockService[F, CexItem],
    private val notificationService: NotificationService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    stockService
      .stockUpdates[D](stockMonitorConfig)
      .evalMap(upd => upd.updates.traverse_(u => notificationService.stockUpdate(upd.item, u)))
}

object CexStockMonitor {

  def generic[F[_]: Sync](
      config: StockMonitorConfig,
      services: Services[F]
  ): F[Task[F]] =
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
