package ebayapp.core.clients.cex

import io.circe.Codec

object responses {
  final case class CexItem(
      boxId: String,
      boxName: String,
      categoryName: String,
      categoryFriendlyName: String,
      cannotBuy: Int,
      sellPrice: Double,
      exchangePrice: Double,
      cashPrice: Double,
      ecomQuantityOnHand: Int
  ) derives Codec.AsObject

  final case class SearchResults(
      boxes: List[CexItem],
      totalRecords: Int,
      minPrice: Double,
      maxPrice: Double
  ) derives Codec.AsObject

  final case class SearchResponse(data: Option[SearchResults]) derives Codec.AsObject

  final case class CexSearchResponse(response: SearchResponse) derives Codec.AsObject
}
