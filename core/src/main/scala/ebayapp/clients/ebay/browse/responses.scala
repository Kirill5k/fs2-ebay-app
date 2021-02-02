package ebayapp.clients.ebay.browse

import java.time.Instant

import scala.math.BigDecimal

private[ebay] object responses {
  sealed trait EbayBrowseResponse

  final case class ItemProperty(name: String, value: String)
  final case class ItemSeller(username: Option[String], feedbackPercentage: Option[Double], feedbackScore: Option[Int])
  final case class ItemImage(imageUrl: String)
  final case class ItemPrice(value: BigDecimal, currency: String)
  final case class ShippingCost(value: BigDecimal, currency: String)
  final case class ItemShippingOption(shippingServiceCode: String, shippingCost: ShippingCost)

  final case class EbayItemSummary(
      itemId: String,
      title: String,
      price: Option[ItemPrice],
      seller: ItemSeller,
      itemGroupType: Option[String],
      shortDescription: Option[String] // This field is returned by the search method only when fieldgroups = EXTENDED.
  )

  final case class ItemAvailabilities(
      availabilityThreshold: Option[Int],
      estimatedAvailableQuantity: Option[Int]
  )

  final case class EbayItem(
      itemId: String,
      title: String,
      shortDescription: Option[String],
      description: Option[String],
      categoryPath: String,
      categoryId: Int,
      price: ItemPrice,
      condition: String,
      image: Option[ItemImage],
      seller: ItemSeller,
      localizedAspects: Option[List[ItemProperty]],
      buyingOptions: List[String],
      itemWebUrl: String,
      color: Option[String],
      brand: Option[String],
      mpn: Option[String],
      itemEndDate: Option[Instant],
      shippingOptions: Option[List[ItemShippingOption]],
      estimatedAvailabilities: Option[List[ItemAvailabilities]]
  ) extends EbayBrowseResponse

  final case class EbayBrowseResult(total: Int, limit: Int, itemSummaries: Option[List[EbayItemSummary]]) extends EbayBrowseResponse

  final case class EbayError(errorId: Long, domain: String, category: String, message: String)
  final case class EbayErrorResponse(errors: List[EbayError]) extends EbayBrowseResponse
}
