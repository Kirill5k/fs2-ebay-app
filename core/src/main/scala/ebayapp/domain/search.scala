package ebayapp.domain

import java.time.Instant

object search {

  final case class SearchQuery(value: String) extends AnyVal

  final case class SellPrice(
      cash: BigDecimal,
      credit: BigDecimal
  )

  final case class BuyPrice(
      quantityAvailable: Int,
      value: BigDecimal
  )

  final case class ListingDetails(
      url: String,
      title: String,
      shortDescription: Option[String],
      description: Option[String],
      image: Option[String],
      condition: String,
      datePosted: Instant,
      seller: String,
      properties: Map[String, String]
  )
}
