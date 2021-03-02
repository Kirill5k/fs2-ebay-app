package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import ebayapp.clients.cex.CexClient
import ebayapp.clients.ebay.EbayClient
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.common.config.{EbayDealsConfig, SearchQuery}
import ebayapp.common.stream._
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.common.Logger
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
