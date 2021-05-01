package ebayapp.core.tasks

import cats.Monad
import cats.effect.Concurrent
import cats.implicits._
import ebayapp.core.clients.argos.mappers._
import ebayapp.core.clients.argos.responses.ArgosItem
import ebayapp.core.clients.cex.mappers._
import ebayapp.core.clients.cex.responses.CexItem
import ebayapp.core.clients.jdsports.mappers.JdsportsItem
import ebayapp.core.clients.nvidia.responses.NvidiaItem
import ebayapp.core.clients.nvidia.mappers._
import ebayapp.core.clients.scan.parsers.ScanItem
import ebayapp.core.clients.scan.mappers._
import ebayapp.core.clients.selfridges.mappers._
import ebayapp.core.common.config.AppConfig
import ebayapp.core.domain.ItemDetails
import ebayapp.core.services.{NotificationService, Services, StockService}
import fs2.Stream

final class StockMonitor[F[_]: Concurrent](
    private val config: AppConfig,
    private val notificationService: NotificationService[F],
    private val cexStockService: StockService[F, CexItem],
    private val argosStockService: StockService[F, ArgosItem],
    private val selfridgesStockService: StockService[F, SelfridgesItem],
    private val jdsportsStockService: StockService[F, JdsportsItem],
    private val nvidiaStockService: StockService[F, NvidiaItem],
    private val scanStockService: StockService[F, ScanItem]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    Stream(
      cexStockService.stockUpdates[ItemDetails.Generic](config.cex.stockMonitor),
      argosStockService.stockUpdates[ItemDetails.Generic](config.argos.stockMonitor),
      selfridgesStockService.stockUpdates[ItemDetails.Clothing](config.selfridges.stockMonitor),
      jdsportsStockService.stockUpdates[ItemDetails.Clothing](config.jdsports.stockMonitor),
      nvidiaStockService.stockUpdates[ItemDetails.Generic](config.nvidia.stockMonitor),
      scanStockService.stockUpdates[ItemDetails.Generic](config.scan.stockMonitor)
    ).parJoinUnbounded
      .evalMap(upd => upd.updates.traverse_(u => notificationService.stockUpdate(upd.item, u)))
}

object StockMonitor {
  def make[F[_]: Concurrent](config: AppConfig, services: Services[F]): F[Task[F]] =
    Monad[F].pure(
      new StockMonitor[F](
        config,
        services.notification,
        services.cexStock,
        services.argosStock,
        services.selfridgesSale,
        services.jdsportsSale,
        services.nvidiaStock,
        services.scanStock
      )
    )
}
