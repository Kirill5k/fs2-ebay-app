package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient
import ebayapp.clients.ebay.EbayClient
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.common.config.{EbayDealsConfig, SearchQuery}
import ebayapp.domain.{ItemDetails, ResellableItem}
import fs2.Stream
import io.chrisdavenport.log4cats.Logger

import scala.concurrent.duration._

trait EbayDealsService[F[_]] {
  def deals[D <: ItemDetails](
      config: EbayDealsConfig
  )(
      implicit m: EbayItemMapper[D],
      p: EbaySearchParams[D]
  ): fs2.Stream[F, ResellableItem[D]]
}

final class LiveEbayDealsService[F[_]: Logger: Concurrent: Timer](
    private val ebayClient: EbayClient[F],
    private val cexClient: CexClient[F]
) extends EbayDealsService[F] {

  override def deals[D <: ItemDetails](config: EbayDealsConfig)(
      implicit m: EbayItemMapper[D],
      p: EbaySearchParams[D]
  ): fs2.Stream[F, ResellableItem[D]] =
    (
      fs2.Stream
        .emits(config.searchQueries)
        .map(query => find(query, config.maxListingDuration))
        .parJoinUnbounded ++
        fs2.Stream.sleep(config.searchFrequency).drain
    ).repeat

  private def find[D <: ItemDetails](
      query: SearchQuery,
      duration: FiniteDuration
  )(
      implicit m: EbayItemMapper[D],
      p: EbaySearchParams[D]
  ): fs2.Stream[F, ResellableItem[D]] =
    ebayClient
      .findLatestItems[D](query, duration)
      .evalMap { item =>
        item.itemDetails.fullName match {
          case Some(name) =>
            cexClient.findSellPrice(SearchQuery(name)).map(sp => item.copy(sellPrice = sp))
          case None =>
            Logger[F].warn(s"""not enough details to query for resell price: "${item.listingDetails.title}"""") *>
              Sync[F].pure(item)
        }
      }
      .handleErrorWith { error =>
        Stream.eval(Logger[F].error(error)(s"error getting deals from ebay")).drain
      }
}

object EbayDealsService {

  def make[F[_]: Concurrent: Logger: Timer](
      ebayClient: EbayClient[F],
      cexClient: CexClient[F]
  ): F[EbayDealsService[F]] =
    Sync[F].delay(new LiveEbayDealsService[F](ebayClient, cexClient))
}
