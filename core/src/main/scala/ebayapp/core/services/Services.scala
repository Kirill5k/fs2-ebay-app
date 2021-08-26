package ebayapp.core.services

import cats.effect.Temporal
import cats.syntax.traverse._
import cats.syntax.apply._
import ebayapp.core.clients.Clients
import ebayapp.core.common.Logger
import ebayapp.core.common.config.AppConfig
import ebayapp.core.repositories.Repositories

trait Services[F[_]] {
  def notification: NotificationService[F]
  def resellableItem: ResellableItemService[F]
  def stock: List[StockService[F]]
  def deals: List[DealsService[F]]
}

object Services {

  def make[F[_]: Temporal: Logger](
      config: AppConfig,
      clients: Clients[F],
      repo: Repositories[F]
  ): F[Services[F]] =
    (
      NotificationService.make[F](clients.messenger),
      ResellableItemService.make[F](repo.resellableItems),
      config.stockMonitor.toList.traverse { case (r, c) => StockService.make(r, c, clients.get(r)) },
      config.dealsFinder.toList.traverse { case (r, c) => DealsService.make(r, c, clients.get(r), clients.cex, repo.resellableItems) }
    ).mapN((not, rs, ss, ds) =>
      new Services[F] {
        def notification: NotificationService[F]     = not
        def resellableItem: ResellableItemService[F] = rs
        def stock: List[StockService[F]]             = ss
        def deals: List[DealsService[F]]             = ds
      }
    )
}
