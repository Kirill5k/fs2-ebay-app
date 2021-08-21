package ebayapp.core.services

import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.Clients
import ebayapp.core.common.Logger
import ebayapp.core.repositories.Repositories

trait Services[F[_]] {
  def notification: NotificationService[F]
  def resellableItem: ResellableItemService[F]
  def ebayDeals: EbayDealsService[F]
  def cexStock: StockService[F]
  def selfridgesSale: StockService[F]
  def argosStock: StockService[F]
  def jdsportsSale: StockService[F]
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
      EbayDealsService.make[F](clients.ebay, clients.cex),
      StockService.cex[F](clients.cex),
      StockService.selfridges[F](clients.selfridges),
      StockService.argos[F](clients.argos),
      StockService.jdsports[F](clients.jdsports),
      StockService.tessuti[F](clients.tessuti),
      StockService.nvidia[F](clients.nvidia),
      StockService.scan[F](clients.scan)
    ).mapN((not, rs, es, cs, selfridgesS, as, js, ts, nvidiaS, scanS) =>
      new Services[F] {
        def notification: NotificationService[F]     = not
        def resellableItem: ResellableItemService[F] = rs
        def ebayDeals: EbayDealsService[F]           = es
        def cexStock: StockService[F]                = cs
        def selfridgesSale: StockService[F]          = selfridgesS
        def argosStock: StockService[F]              = as
        def jdsportsSale: StockService[F]            = js
        def tessutiSale: StockService[F]             = ts
        def nvidiaStock: StockService[F]             = nvidiaS
        def scanStock: StockService[F]               = scanS
      }
    )
}
