package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.ebay.EbayClient
import ebayapp.core.clients.ebay.mappers.EbayItemMapper.EbayItemMapper
import ebayapp.core.clients.ebay.search.EbaySearchParams
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{EbayDealsConfig, SearchQuery}
import ebayapp.core.common.stream._
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2._

import scala.concurrent.duration._

trait EbayDealsService[F[_]] {
  def deals[D <: ItemDetails: EbayItemMapper: EbaySearchParams](config: EbayDealsConfig): Stream[F, ResellableItem[D]]
}

final class LiveEbayDealsService[F[_]: Logger: Temporal](
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
      .metered(250.millis)
      .handleErrorWith { error =>
        Stream.eval(Logger[F].warn(error)(s"error getting deals from ebay")).drain
      }
}

object EbayDealsService {

  def make[F[_]: Temporal: Logger](
      ebayClient: EbayClient[F],
      cexClient: CexClient[F]
  ): F[EbayDealsService[F]] =
    Monad[F].pure(new LiveEbayDealsService[F](ebayClient, cexClient))
}
