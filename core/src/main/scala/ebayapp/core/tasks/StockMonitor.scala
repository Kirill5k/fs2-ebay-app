package ebayapp.core.tasks

import cats.Monad
import cats.effect.Concurrent
import cats.implicits._
import ebayapp.core.common.config.AppConfig
import ebayapp.core.services.{NotificationService, Services, StockService}
import fs2.Stream

final class StockMonitor[F[_]: Concurrent](
    private val config: AppConfig,
    private val notificationService: NotificationService[F],
    private val cexStockService: StockService[F],
    private val argosStockService: StockService[F],
    private val selfridgesStockService: StockService[F],
    private val jdsportsStockService: StockService[F],
    private val scottsStockService: StockService[F],
    private val tessutiStockService: StockService[F],
    private val nvidiaStockService: StockService[F],
    private val scanStockService: StockService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    Stream(
      cexStockService.stockUpdates(config.cex.stockMonitor),
      argosStockService.stockUpdates(config.argos.stockMonitor),
      selfridgesStockService.stockUpdates(config.selfridges.stockMonitor),
      jdsportsStockService.stockUpdates(config.jdsports.stockMonitor),
      scottsStockService.stockUpdates(config.tessuti.stockMonitor),
      tessutiStockService.stockUpdates(config.tessuti.stockMonitor),
      nvidiaStockService.stockUpdates(config.nvidia.stockMonitor),
      scanStockService.stockUpdates(config.scan.stockMonitor)
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
        services.scottsSale,
        services.tessutiSale,
        services.nvidiaStock,
        services.scanStock
      )
    )
}
