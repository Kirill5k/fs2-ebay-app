package ebayapp.services

import cats.effect.{Sync, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient
import ebayapp.clients.ebay.EbayClient
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.domain.search.SearchQuery
import ebayapp.domain.{ItemDetails, ResellableItem}
import io.chrisdavenport.log4cats.Logger

import scala.concurrent.duration._

trait EbayDealsSearchService[F[_], A] {
  def find(query: SearchQuery, duration: FiniteDuration): fs2.Stream[F, A]
}

final class ResellableItemEbayDealsSearchService[F[_], D <: ItemDetails](
    private val ebayClient: EbayClient[F],
    private val cexClient: CexClient[F]
)(
    implicit val M: EbayItemMapper[D],
    val P: EbaySearchParams[D],
    val S: Sync[F],
    val L: Logger[F],
    val T: Timer[F]
) extends EbayDealsSearchService[F, ResellableItem[D]] {

  override def find(query: SearchQuery, duration: FiniteDuration): fs2.Stream[F, ResellableItem[D]] =
    ebayClient
      .findLatestItems[D](query, duration)
      .evalMap { item =>
        item.itemDetails.fullName match {
          case Some(name) =>
            T.sleep(200.millis) *>
              cexClient.findResellPrice(SearchQuery(name)).map(sp => item.copy(sellPrice = sp))
          case None =>
            L.warn(s"not enough details to query for resell price ${item.itemDetails}") *>
              S.pure(item)
        }
      }
}

object EbayDealsSearchService {

  def videoGames[F[_]: Sync: Timer: Logger](
      ebayClient: EbayClient[F],
      cexClient: CexClient[F]
  ): F[EbayDealsSearchService[F, ResellableItem.VideoGame]] =
    Sync[F].delay(
      new ResellableItemEbayDealsSearchService[F, ItemDetails.Game](
        ebayClient,
        cexClient
      )(
        EbayItemMapper.gameDetailsMapper,
        EbaySearchParams.videoGameSearchParams,
        Sync[F],
        Logger[F],
        Timer[F]
      )
    )
}
