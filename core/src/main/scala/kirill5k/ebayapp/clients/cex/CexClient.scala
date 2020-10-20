package kirill5k.ebayapp.clients.cex

import cats.effect.Sync
import io.chrisdavenport.log4cats.Logger
import kirill5k.ebayapp.common.Cache
import kirill5k.ebayapp.common.config.CexConfig
import kirill5k.ebayapp.resellables.{ItemDetails, ResellPrice, ResellableItem, SearchQuery}
import sttp.client.{NothingT, SttpBackend}

final class CexClient[F[_]](
    private val config: CexConfig,
    private val searchResultsCache: Cache[F, SearchQuery, Option[ResellPrice]]
)(
    implicit val B: SttpBackend[F, Nothing, NothingT],
    S: Sync[F],
    L: Logger[F]
) {

  def findResellPrice(query: SearchQuery): F[Option[ResellPrice]] = ???

  def getCurrentStock[D <: ItemDetails](query: SearchQuery)(
      implicit mapper: CexItemMapper[D]
  ): F[List[ResellableItem[D]]] = ???
}

object CexClient {
  final case class SearchResult(
      boxId: String,
      boxName: String,
      categoryName: String,
      sellPrice: Double,
      exchangePrice: Double,
      cashPrice: Double,
      ecomQuantityOnHand: Int
  )

  final case class SearchResults(
      boxes: List[SearchResult],
      totalRecords: Int,
      minPrice: Double,
      maxPrice: Double
  )

  final case class SearchResponse(data: Option[SearchResults])

  final case class CexSearchResponse(response: SearchResponse)
}
