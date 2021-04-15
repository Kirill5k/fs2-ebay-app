package ebayapp.core.domain

import java.time.Instant

object search {

  final case class SellPrice(
      cash: BigDecimal,
      credit: BigDecimal
  )

  final case class BuyPrice(
      quantityAvailable: Int,
      rrp: BigDecimal,
      discount: Option[Int] = None
  )

  final case class ListingDetails(
      url: String,
      title: String,
      category: Option[String],
      shortDescription: Option[String],
      description: Option[String],
      image: Option[String],
      condition: String,
      datePosted: Instant,
      seller: String,
      properties: Map[String, String]
  )
}
