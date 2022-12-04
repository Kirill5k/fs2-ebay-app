package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.syntax.functor.*
import ebayapp.core.clients.SearchClient
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.common.{ConfigProvider, Logger}
import ebayapp.core.common.config.{DealsFinderConfig, DealsFinderRequest}
import ebayapp.kernel.syntax.stream.*
import ebayapp.core.domain.{ResellableItem, Retailer}
import ebayapp.core.repositories.ResellableItemRepository
import fs2.*

import scala.concurrent.duration.*

trait DealsService[F[_]]:
  def newDeals: Stream[F, ResellableItem]

final private class LiveDealsService[F[_]: Logger: Temporal](
    private val retailer: Retailer,
    private val configProvider: ConfigProvider[F],
    private val searchClient: SearchClient[F],
    private val cexClient: CexClient[F],
    private val repository: ResellableItemRepository[F]
) extends DealsService[F] {

  private def isNew(item: ResellableItem): F[Boolean] =
    repository.existsByUrl(item.listingDetails.url).map(!_)

  private inline def hasRequiredStock(req: DealsFinderRequest): ResellableItem => Boolean =
    item => item.buyPrice.quantityAvailable > 0 && item.buyPrice.quantityAvailable < req.maxQuantity.getOrElse(Int.MaxValue)

  private inline def isProfitableToResell(req: DealsFinderRequest): ResellableItem => Boolean =
    item => item.sellPrice.exists(rp => (rp.credit * 100 / item.buyPrice.rrp - 100) > req.minMargin)

  override def newDeals: Stream[F, ResellableItem] =
    configProvider
      .dealsFinder(retailer)
      .flatMap { config =>
        Stream
          .emits(config.searchRequests.zipWithIndex)
          .map { (req, i) =>
            searchClient
              .search(req.searchCriteria)
              .evalFilter(isNew)
              .evalMap(cexClient.withUpdatedSellPrice(req.searchCriteria.category))
              .evalTap(repository.save)
              .filter(hasRequiredStock(req))
              .filter(isProfitableToResell(req))
              .metered(250.millis)
              .handleErrorWith(e => Stream.logError(e)(s"${retailer.name}-deals/error - ${e.getMessage}"))
              .delayBy(config.delayBetweenRequests.getOrElse(Duration.Zero) * i.toLong)
          }
          .parJoinUnbounded
          .repeatEvery(config.searchFrequency)
      }
}

object DealsService:
  def make[F[_]: Temporal: Logger](
      retailer: Retailer,
      configProvider: ConfigProvider[F],
      searchClient: SearchClient[F],
      cexClient: CexClient[F],
      repository: ResellableItemRepository[F]
  ): F[DealsService[F]] =
    Monad[F].pure(LiveDealsService[F](retailer, configProvider, searchClient, cexClient, repository))
