package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.syntax.functor._
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.ebay.EbayClient
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{DealsFinderConfig, DealsFinderRequest}
import ebayapp.core.common.stream._
import ebayapp.core.domain.ResellableItem
import ebayapp.core.repositories.ResellableItemRepository
import fs2._

import scala.concurrent.duration._

trait DealsService[F[_]] {
  def newDeals(config: DealsFinderConfig): Stream[F, ResellableItem]
}

private final class EbayDealsService[F[_]: Logger: Temporal](
    private val ebayClient: EbayClient[F],
    private val cexClient: CexClient[F],
    private val repository: ResellableItemRepository[F],
    private val name: String
) extends DealsService[F] {

  private def isNew(item: ResellableItem): F[Boolean] =
    repository.existsByUrl(item.listingDetails.url).map(!_)

  private def hasRequiredStock(req: DealsFinderRequest): ResellableItem => Boolean =
    item => item.buyPrice.quantityAvailable > 0 && item.buyPrice.quantityAvailable < req.maxQuantity.getOrElse(Int.MaxValue)

  private def isProfitableToResell(req: DealsFinderRequest): ResellableItem => Boolean =
    item => item.sellPrice.exists(rp => (rp.credit * 100 / item.buyPrice.rrp - 100) > req.minMargin)

  override def newDeals(config: DealsFinderConfig): Stream[F, ResellableItem] =
    Stream
      .emits(config.searchRequests)
      .map { req =>
        ebayClient
          .search(req.searchCriteria)
          .evalFilter(isNew)
          .evalMap(cexClient.withUpdatedSellPrice)
          .evalTap(repository.save)
          .filter(hasRequiredStock(req))
          .filter(isProfitableToResell(req))
          .metered(250.millis)
          .handleErrorWith { error =>
            Stream.eval(Logger[F].error(error)(s"$name-deals/error - ${error.getMessage}")).drain
          }
      }
      .parJoinUnbounded
      .repeatEvery(config.searchFrequency)
}

object DealsService {

  def ebay[F[_]: Temporal: Logger](
      ebayClient: EbayClient[F],
      cexClient: CexClient[F],
      repository: ResellableItemRepository[F]
  ): F[DealsService[F]] =
    Monad[F].pure(new EbayDealsService[F](ebayClient, cexClient, repository, "ebay"))
}
