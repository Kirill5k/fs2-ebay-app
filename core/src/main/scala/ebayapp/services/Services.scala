package ebayapp.services

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.clients.Clients
import ebayapp.common.config.AppConfig
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.repositories.Repositories
import io.chrisdavenport.log4cats.Logger

final case class Services[F[_]](
    notification: NotificationService[F],
    videoGame: ResellableItemService[F, ItemDetails.Game],
    videoGameEbayDeals: EbayDealsService[F, ResellableItem[ItemDetails.Game]],
    genericStockCheck: CexStockService[F, ItemDetails.Generic]
)

object Services {

  def make[F[_]: Concurrent: Timer: Logger](
      config: AppConfig,
      clients: Clients[F],
      repositories: Repositories[F]
  ): F[Services[F]] =
    (
      NotificationService.telegram[F](clients.telegram),
      ResellableItemService.videoGame[F](repositories.videoGames),
      EbayDealsService.videoGames[F](clients.ebay, clients.cex),
      CexStockService.genericStateful[F](config.cex, clients.cex)
    ).mapN(Services.apply)
}
