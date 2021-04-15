package ebayapp.core.services

import cats.effect.{Concurrent, Sync, Timer}
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.ebay.EbayClient
import ebayapp.core.clients.ebay.mappers.EbayItemMapper.EbayItemMapper
import ebayapp.core.clients.ebay.search.EbaySearchParams
import ebayapp.core.common.config.{EbayDealsConfig, SearchQuery}
import ebayapp.core.common.stream._
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.common.Logger
import fs2._

import scala.concurrent.duration._

trait EbayDealsService[F[_]] {
  def deals[D <: ItemDetails: EbayItemMapper: EbaySearchParams](config: EbayDealsConfig): Stream[F, ResellableItem[D]]
}

final class LiveEbayDealsService[F[_]: Logger: Concurrent: Timer](
    private val ebayClient: EbayClient[F],
    private val cexClient: CexClient[F]
) extends EbayDealsService[F] {

  override def deals[D <: ItemDetails: EbayItemMapper: EbaySearchParams](config: EbayDealsConfig): Stream[F, ResellableItem[D]] =
    Stream
      .emits(config.searchQueries)
      .map(query => find(query, config.maxListingDuration))
      .parJoinUnbounded
      .repeatEvery(config.searchFrequency)

  private def find[D <: ItemDetails: EbayItemMapper: EbaySearchParams](
      query: SearchQuery,
      duration: FiniteDuration
  ): Stream[F, ResellableItem[D]] =
    ebayClient
      .latest[D](query, duration)
      .evalMap(cexClient.withUpdatedSellPrice)
      .handleErrorWith { error =>
        Stream.eval_(Logger[F].warn(error)(s"error getting deals from ebay"))
      }
}

object EbayDealsService {

  def make[F[_]: Concurrent: Logger: Timer](
      ebayClient: EbayClient[F],
      cexClient: CexClient[F]
  ): F[EbayDealsService[F]] =
    Sync[F].delay(new LiveEbayDealsService[F](ebayClient, cexClient))
}
