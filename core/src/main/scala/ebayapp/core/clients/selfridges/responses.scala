package ebayapp.core.clients.selfridges

private[selfridges] object responses {

  final case class ItemPrice(
      SKUID: String,
      `Current Retail Price`: BigDecimal,
      `Was Retail Price`: Option[BigDecimal],
      `Was Was Retail Price`: Option[BigDecimal]
  )

  final case class SelfridgesItemPriceResponse(
      prices: Option[List[ItemPrice]]
  )

  final case class ItemStock(
      SKUID: String,
      value: Option[String],
      `Stock Quantity Available to Purchase`: Int
  )

  final case class SelfridgesItemStockResponse(
      stocks: Option[List[ItemStock]]
  )

  final case class CatalogItemPrice(
      lowestPrice: BigDecimal,
      lowestWasPrice: Option[BigDecimal],
      lowestWasWasPrice: Option[BigDecimal],
      currency: String
  )

  final case class CatalogItem(
      partNumber: String,
      seoKey: String,
      imageName: String,
      name: String,
      brandName: String,
      price: List[CatalogItemPrice]
  )

  final case class SelfridgesSearchResponse(
      noOfPages: Int,
      pageNumber: Option[Int],
      catalogEntryNavView: List[CatalogItem]
  )
}
