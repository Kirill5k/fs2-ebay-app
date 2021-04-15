package ebayapp.core.services

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.core.clients.Clients
import ebayapp.core.clients.argos.responses.ArgosItem
import ebayapp.core.clients.cex.responses.CexItem
import ebayapp.core.clients.jdsports.mappers.JdsportsItem
import ebayapp.core.clients.selfridges.mappers.SelfridgesItem
import ebayapp.core.domain.ItemDetails
import ebayapp.core.repositories.Repositories
import ebayapp.core.common.Logger

trait Services[F[_]] {
  def notification: NotificationService[F]
  def videoGame: ResellableItemService[F, ItemDetails.Game]
  def ebayDeals: EbayDealsService[F]
  def cexStock: StockService[F, CexItem]
  def selfridgesSale: StockService[F, SelfridgesItem]
  def argosStock: StockService[F, ArgosItem]
  def jdsportsSale: StockService[F, JdsportsItem]
}

object Services {

  def make[F[_]: Concurrent: Timer: Logger](
      clients: Clients[F],
      repositories: Repositories[F]
  ): F[Services[F]] =
    (
      NotificationService.telegram[F](clients.telegram),
      ResellableItemService.videoGame[F](repositories.videoGames),
      EbayDealsService.make[F](clients.ebay, clients.cex),
      StockService.cex[F](clients.cex),
      StockService.selfridges[F](clients.selfridges),
      StockService.argos[F](clients.argos),
      StockService.jdsports[F](clients.jdsports)
    ).mapN((ns, vs, es, cs, ss, as, js) =>
      new Services[F] {
        def notification: NotificationService[F]                  = ns
        def videoGame: ResellableItemService[F, ItemDetails.Game] = vs
        def ebayDeals: EbayDealsService[F]                        = es
        def cexStock: StockService[F, CexItem]                    = cs
        def selfridgesSale: StockService[F, SelfridgesItem]       = ss
        def argosStock: StockService[F, ArgosItem]                = as
        def jdsportsSale: StockService[F, JdsportsItem]           = js
      }
    )
}
