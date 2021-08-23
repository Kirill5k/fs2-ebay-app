package ebayapp.core.services

import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.{Clients, Retailer}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.AppConfig
import ebayapp.core.repositories.Repositories

trait Services[F[_]] {
  def notification: NotificationService[F]
  def resellableItem: ResellableItemService[F]
  def ebayDeals: DealsService[F]
  def stock: List[StockService[F]]
}

object Services {

  def make[F[_]: Temporal: Logger](
      config: AppConfig,
      clients: Clients[F],
      repositories: Repositories[F]
  ): F[Services[F]] =
    (
      NotificationService.telegram[F](clients.telegram),
      ResellableItemService.make[F](repositories.resellableItems),
      DealsService.ebay[F](config.ebay.dealsFinder, clients.get(Retailer.Ebay), clients.cex, repositories.resellableItems),
      config.stockMonitor.toList.traverse { case (r, c) => StockService.make(r, c, clients.get(r)) }
    ).mapN((not, rs, es, ss) =>
      new Services[F] {
        def notification: NotificationService[F]     = not
        def resellableItem: ResellableItemService[F] = rs
        def ebayDeals: DealsService[F]               = es
        def stock: List[StockService[F]]             = ss
      }
    )
}
