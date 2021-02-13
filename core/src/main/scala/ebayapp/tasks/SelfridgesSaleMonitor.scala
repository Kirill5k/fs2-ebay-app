package ebayapp.tasks

import cats.effect.Sync
import cats.implicits._
import ebayapp.common.config.StockMonitorConfig
import ebayapp.services.{NotificationService, SelfridgesSaleService, Services}
import fs2.Stream

final class SelfridgesSaleMonitor[F[_]: Sync](
    private val stockMonitorConfig: StockMonitorConfig,
    private val saleService: SelfridgesSaleService[F],
    private val notificationService: NotificationService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    saleService
      .newSaleItems(stockMonitorConfig)
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
