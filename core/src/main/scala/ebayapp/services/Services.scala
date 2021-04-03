package ebayapp.services

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.clients.Clients
import ebayapp.clients.argos.responses.ArgosItem
import ebayapp.clients.cex.responses.CexItem
import ebayapp.clients.selfridges.mappers.SelfridgesItem
import ebayapp.domain.ItemDetails
import ebayapp.repositories.Repositories
import ebayapp.common.Logger

final case class Services[F[_]](
    notification: NotificationService[F],
    videoGame: ResellableItemService[F, ItemDetails.Game],
    ebayDeals: EbayDealsService[F],
    cexStock: StockService[F, CexItem],
    selfridgesSale: StockService[F, SelfridgesItem],
    argosStock: StockService[F, ArgosItem]
)

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
      StockService.argos[F](clients.argos)
    ).mapN(Services[F])
}
