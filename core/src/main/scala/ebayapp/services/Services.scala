package ebayapp.services

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.clients.Clients
import ebayapp.domain.ItemDetails
import ebayapp.repositories.Repositories
import ebayapp.common.LoggerF

final case class Services[F[_]](
    notification: NotificationService[F],
    videoGame: ResellableItemService[F, ItemDetails.Game],
    ebayDeals: EbayDealsService[F],
    cexStock: CexStockService[F],
    selfridgesSale: SelfridgesSaleService[F]
)

object Services {

  def make[F[_]: Concurrent: Timer: LoggerF](
      clients: Clients[F],
      repositories: Repositories[F]
  ): F[Services[F]] =
    (
      NotificationService.telegram[F](clients.telegram),
      ResellableItemService.videoGame[F](repositories.videoGames),
      EbayDealsService.make[F](clients.ebay, clients.cex),
      CexStockService.make[F](clients.cex),
      SelfridgesSaleService.make[F](clients.selfridges)
    ).mapN(Services.apply)
}
