package ebayapp.tasks

import cats.effect.Concurrent
import cats.implicits._
import ebayapp.clients.argos.mappers._
import ebayapp.clients.argos.responses.ArgosItem
import ebayapp.clients.cex.mappers._
import ebayapp.clients.cex.responses.CexItem
import ebayapp.clients.selfridges.mappers._
import ebayapp.common.config.AppConfig
import ebayapp.domain.ItemDetails
import ebayapp.services.{NotificationService, StockService}
import fs2.Stream

final class StockMonitor[F[_]: Concurrent](
    private val config: AppConfig,
    private val cexStockService: StockService[F, CexItem],
    private val argosStockService: StockService[F, ArgosItem],
    private val selfridgesStockService: StockService[F, SelfridgesItem],
    private val notificationService: NotificationService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    Stream(
      cexStockService.stockUpdates[ItemDetails.Generic](config.cex.stockMonitor),
      argosStockService.stockUpdates[ItemDetails.Generic](config.argos.stockMonitor),
      selfridgesStockService.stockUpdates[ItemDetails.Clothing](config.selfridges.stockMonitor)
    ).parJoinUnbounded
      .evalMap(upd => upd.updates.traverse_(u => notificationService.stockUpdate(upd.item, u)))
}
