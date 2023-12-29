package ebayapp.core.clients.ebay.browse

import java.time.Instant

import scala.math.BigDecimal
import io.circe.Codec

private[ebay] object responses {

  final case class ItemProperty(
      name: String,
      value: String
  ) derives Codec.AsObject

  final case class ItemSeller(
      username: Option[String],
      feedbackPercentage: Option[Double],
      feedbackScore: Option[Int]
  ) derives Codec.AsObject

  final case class ItemImage(imageUrl: String) derives Codec.AsObject
  final case class ItemPrice(value: BigDecimal, currency: String) derives Codec.AsObject
  final case class ItemCategory(categoryId: String) derives Codec.AsObject
  final case class ShippingCost(value: BigDecimal, currency: String) derives Codec.AsObject
  final case class ItemShippingOption(shippingServiceCode: String, shippingCost: ShippingCost) derives Codec.AsObject

  final case class EbayItemSummary(
      itemId: String,
      title: String,
      price: Option[ItemPrice],
      seller: ItemSeller,
      itemGroupType: Option[String],
      buyingOptions: Set[String],
      shortDescription: Option[String], // This field is returned by the search method only when fieldgroups = EXTENDED.
      leafCategoryIds: Option[Set[String]]
  ) derives Codec.AsObject

  final case class ItemAvailabilities(
      availabilityThreshold: Option[Int],
      estimatedAvailableQuantity: Option[Int]
  ) derives Codec.AsObject

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
      buyingOptions: Set[String],
      itemWebUrl: String,
      color: Option[String],
      brand: Option[String],
      mpn: Option[String],
      itemEndDate: Option[Instant],
      shippingOptions: Option[List[ItemShippingOption]],
      estimatedAvailabilities: Option[List[ItemAvailabilities]]
  ) derives Codec.AsObject

  final case class EbayBrowseResult(total: Int, limit: Int, itemSummaries: Option[List[EbayItemSummary]]) derives Codec.AsObject

  final case class EbayError(errorId: Long, domain: String, category: String, message: String) derives Codec.AsObject
  final case class EbayErrorResponse(errors: List[EbayError]) derives Codec.AsObject
}
