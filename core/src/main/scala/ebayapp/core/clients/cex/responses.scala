package ebayapp.core.clients.cex

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
  )

  final case class SearchResults(
      boxes: List[CexItem],
      totalRecords: Int,
      minPrice: Double,
      maxPrice: Double
  )

  final case class SearchResponse(data: Option[SearchResults])

  final case class CexSearchResponse(response: SearchResponse)
}
