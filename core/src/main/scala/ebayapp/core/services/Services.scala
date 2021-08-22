package ebayapp.core.services

import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.Clients
import ebayapp.core.common.Logger
import ebayapp.core.repositories.Repositories

trait Services[F[_]] {
  def notification: NotificationService[F]
  def resellableItem: ResellableItemService[F]
  def ebayDeals: DealsService[F]
  def cexStock: StockService[F]
  def selfridgesSale: StockService[F]
  def argosStock: StockService[F]
  def jdsportsSale: StockService[F]
  def scottsSale: StockService[F]
  def tessutiSale: StockService[F]
  def nvidiaStock: StockService[F]
  def scanStock: StockService[F]
}

object Services {

  def make[F[_]: Temporal: Logger](
      clients: Clients[F],
      repositories: Repositories[F]
  ): F[Services[F]] =
    (
      NotificationService.telegram[F](clients.telegram),
      ResellableItemService.make[F](repositories.resellableItems),
      DealsService.ebay[F](clients.ebay, clients.cex, repositories.resellableItems),
      StockService.cex[F](clients.cex),
      StockService.selfridges[F](clients.selfridges),
      StockService.argos[F](clients.argos),
      StockService.jdsports[F](clients.jdsports),
      StockService.scotts[F](clients.scotts),
      StockService.tessuti[F](clients.tessuti),
      StockService.nvidia[F](clients.nvidia),
      StockService.scan[F](clients.scan)
    ).mapN((not, rs, es, cs, selfridgesS, as, jdS, scottsS, tessutiS, nvidiaS, scanS) =>
      new Services[F] {
        def notification: NotificationService[F]     = not
        def resellableItem: ResellableItemService[F] = rs
        def ebayDeals: DealsService[F]               = es
        def cexStock: StockService[F]                = cs
        def selfridgesSale: StockService[F]          = selfridgesS
        def argosStock: StockService[F]              = as
        def jdsportsSale: StockService[F]            = jdS
        def scottsSale: StockService[F]              = scottsS
        def tessutiSale: StockService[F]             = tessutiS
        def nvidiaStock: StockService[F]             = nvidiaS
        def scanStock: StockService[F]               = scanS
      }
    )
}
