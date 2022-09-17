package ebayapp.core.services

import cats.effect.Temporal
import cats.syntax.traverse.*
import cats.syntax.apply.*
import ebayapp.core.clients.Clients
import ebayapp.core.common.{ConfigProvider, Logger}
import ebayapp.core.common.config.{AppConfig, DealsFinderConfig, StockMonitorConfig}
import ebayapp.core.repositories.Repositories
import ebayapp.core.domain.Retailer

trait Services[F[_]]:
  def notification: NotificationService[F]
  def resellableItem: ResellableItemService[F]
  def stock: List[StockService[F]]
  def deals: List[DealsService[F]]

object Services {

  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      clients: Clients[F],
      repo: Repositories[F]
  ): F[Services[F]] =
    (
      NotificationService.make[F](clients.messenger),
      ResellableItemService.make[F](repo.resellableItems),
      Retailer.values.toList.traverse(r => StockService.make(r, configProvider, clients.get(r))),
      Retailer.values.toList.traverse(r => DealsService.make(r, configProvider, clients.get(r), clients.cex, repo.resellableItems))
    ).mapN((not, rs, ss: List[StockService[F]], ds: List[DealsService[F]]) =>
      new Services[F] {
        def notification: NotificationService[F]     = not
        def resellableItem: ResellableItemService[F] = rs
        def stock: List[StockService[F]]             = ss
        def deals: List[DealsService[F]]             = ds
      }
    )
}
