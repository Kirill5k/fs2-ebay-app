package ebayapp.core.clients.cex

import io.circe.Codec

private[cex] object responses {

  final case class CexGraphqlItem(
      boxId: String,
      boxName: String,
      categoryId: Int,
      categoryFriendlyName: String,
      firstPrice: BigDecimal,
      previousPrice: BigDecimal,
      ecomQuantity: Int,
      exchangePerc: BigDecimal,
      priceLastChanged: String,
      sellPrice: BigDecimal,
      cashPriceCalculated: BigDecimal,
      exchangePriceCalculated: BigDecimal,
      webBuyAllowed: Int
  ) derives Codec.AsObject

  final case class GraphqlSearchResult(hits: List[CexGraphqlItem]) derives Codec.AsObject

  final case class CexGraphqlSearchResponse(results: List[GraphqlSearchResult]) derives Codec.AsObject

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
