package ebayapp.tasks

import cats.effect.Sync
import cats.implicits._
import ebayapp.clients.selfridges.mappers.SelfridgesItem
import ebayapp.common.config.StockMonitorConfig
import ebayapp.domain.ItemDetails
import ebayapp.services.{NotificationService, Services, StockService}
import fs2.Stream

final class SelfridgesSaleMonitor[F[_]: Sync](
    private val stockMonitorConfig: StockMonitorConfig,
    private val saleService: StockService[F, SelfridgesItem],
    private val notificationService: NotificationService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    saleService
      .stockUpdates[ItemDetails.Clothing](stockMonitorConfig)
      .evalMap(upd => upd.updates.traverse_(u => notificationService.stockUpdate(upd.item, u)))
}

object SelfridgesSaleMonitor {

  def make[F[_]: Sync](
      config: StockMonitorConfig,
      services: Services[F]
  ): F[Task[F]] =
    Sync[F].delay {
      new SelfridgesSaleMonitor[F](
        config,
        services.selfridgesSale,
        services.notification
      )
    }
}
