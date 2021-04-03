package ebayapp.tasks

import cats.effect.Sync
import cats.implicits._
import ebayapp.clients.argos.mappers._
import ebayapp.clients.argos.responses.ArgosItem
import ebayapp.common.config.StockMonitorConfig
import ebayapp.domain.ItemDetails
import ebayapp.services.{NotificationService, Services, StockService}
import fs2.Stream

final class ArgosStockMonitor[F[_]: Sync, D <: ItemDetails: ArgosItemMapper](
    private val stockMonitorConfig: StockMonitorConfig,
    private val stockService: StockService[F, ArgosItem],
    private val notificationService: NotificationService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    stockService
      .stockUpdates[D](stockMonitorConfig)
      .evalMap(upd => upd.updates.traverse_(u => notificationService.stockUpdate(upd.item, u)))
}

object ArgosStockMonitor {

  def generic[F[_]: Sync](
      config: StockMonitorConfig,
      services: Services[F]
  ): F[Task[F]] =
    Sync[F].delay {
      new ArgosStockMonitor[F, ItemDetails.Generic](
        config,
        services.argosStock,
        services.notification
      )(
        Sync[F],
        argosGeneric
      )
    }
}
