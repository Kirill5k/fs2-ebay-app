package ebayapp.core.services

import cats.effect.Temporal
import cats.syntax.traverse.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.Clients
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.repositories.Repositories
import ebayapp.core.domain.Retailer

trait Services[F[_]]:
  def notification: NotificationService[F]
  def resellableItem: ResellableItemService[F]
  def retailConfig: RetailConfigService[F]
  def stock: List[StockService[F]]
  def deals: List[DealsService[F]]

object Services:
  def make[F[_]: {Temporal, Logger}](
      configProvider: RetailConfigProvider[F],
      clients: Clients[F],
      repo: Repositories[F]
  ): F[Services[F]] =
    for
      ris <- ResellableItemService.make[F](repo.resellableItems)
      ns  <- NotificationService.make[F](clients.messenger)
      rc  <- RetailConfigService.make[F](repo.retailConfig)
      ss  <- Retailer.values.toList.traverse(r => StockService.make(r, configProvider, clients.get(r)))
      ds  <- Retailer.values.toList.traverse(r => DealsService.make(r, configProvider, clients.get(r), clients.cex, repo.resellableItems))
    yield new Services[F]:
      def notification: NotificationService[F]     = ns
      def resellableItem: ResellableItemService[F] = ris
      def retailConfig: RetailConfigService[F]     = rc
      def stock: List[StockService[F]]             = ss
      def deals: List[DealsService[F]]             = ds
