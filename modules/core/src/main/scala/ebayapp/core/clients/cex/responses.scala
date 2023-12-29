package ebayapp.core.clients.cex

import io.circe.{Codec, Json, JsonObject}

private[cex] object responses {

  final case class CexGraphqlItem(
      boxId: String,
      boxName: String,
      categoryId: Int,
      categoryFriendlyName: String,
      firstPrice: Option[BigDecimal],
      previousPrice: Option[BigDecimal],
      ecomQuantity: Option[Json],
      exchangePerc: BigDecimal,
      priceLastChanged: Option[String],
      sellPrice: BigDecimal,
      cashPriceCalculated: BigDecimal,
      exchangePriceCalculated: BigDecimal,
      webBuyAllowed: Int,
      Grade: Option[List[String]],
      imageUrls: Option[JsonObject]
  ) derives Codec.AsObject {
    def quantityAvailable: Option[Int] =
      ecomQuantity match
        case Some(j) if j.isNumber => j.asNumber.flatMap(_.toInt)
        case Some(j) if j.isArray  => j.asArray.flatMap(_.flatMap(_.asNumber).flatMap(_.toInt).maxOption)
        case _                     => None
    def imageUrl: Option[String] =
      imageUrls
        .flatMap(_("medium"))
        .flatMap(_.asString)
        .orElse(imageUrls.flatMap(_("large")).flatMap(_.asString))
        .orElse(imageUrls.flatMap(_("small")).flatMap(_.asString))
  }

  final case class GraphqlSearchResult(hits: List[CexGraphqlItem]) derives Codec.AsObject

  final case class CexGraphqlSearchResponse(results: Option[List[GraphqlSearchResult]]) derives Codec.AsObject

  object CexGraphqlSearchResponse {
    val empty = CexGraphqlSearchResponse(Some(Nil))
  }

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
