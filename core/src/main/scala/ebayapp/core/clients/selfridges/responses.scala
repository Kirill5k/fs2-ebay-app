package ebayapp.core.clients.selfridges

import io.circe.Codec

private[selfridges] object responses {

  final case class ItemPrice(
      SKUID: String,
      `Current Retail Price`: BigDecimal,
      `Was Retail Price`: Option[BigDecimal],
      `Was Was Retail Price`: Option[BigDecimal]
  ) derives Codec.AsObject

  final case class SelfridgesItemPriceResponse(
      prices: Option[List[ItemPrice]]
  ) derives Codec.AsObject

  final case class ItemStock(
      SKUID: String,
      value: Option[String],
      `Stock Quantity Available to Purchase`: Int,
      key: Option[String]
  ) derives Codec.AsObject

  final case class SelfridgesItemStockResponse(
      stocks: Option[List[ItemStock]]
  ) derives Codec.AsObject

  final case class CatalogItemPrice(
      lowestPrice: BigDecimal,
      lowestWasPrice: Option[BigDecimal],
      lowestWasWasPrice: Option[BigDecimal],
      currency: String
  ) derives Codec.AsObject

  final case class CatalogItem(
      partNumber: String,
      seoKey: String,
      imageName: Option[String],
      name: Option[String],
      brandName: String,
      price: List[CatalogItemPrice],
      shortDescription: Option[String]
  ) derives Codec.AsObject {
    private def deriveNameFromSeoKey: String =
      seoKey.toUpperCase
        .replaceAll("-|_", " ")
        .replaceFirst(brandName.toUpperCase, "")
        .replaceFirst(partNumber.toUpperCase, "")
        .trim
        .toLowerCase
        .capitalize

    val isOnSale: Boolean = price.exists(p => p.lowestWasPrice.isDefined || p.lowestWasWasPrice.isDefined)
    val fullName: String  = name.getOrElse(deriveNameFromSeoKey)
  }

  final case class SelfridgesSearchResponse(
      noOfPages: Int,
      pageNumber: Option[Int],
      catalogEntryNavView: List[CatalogItem]
  ) derives Codec.AsObject
}
