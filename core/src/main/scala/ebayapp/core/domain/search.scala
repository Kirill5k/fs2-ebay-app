package ebayapp.core.domain

import pureconfig.*
import pureconfig.generic.derivation.default.*
import io.circe.Codec

import java.time.Instant

object search {

  final case class SearchCriteria(
      query: String,
      category: Option[String] = None,
      itemKind: Option[ItemKind] = None,
      minDiscount: Option[Int] = None,
      excludeFilters: Option[List[String]] = None,
      includeFilters: Option[List[String]] = None
  ) derives ConfigReader, Codec.AsObject:
    val excludeFilterRegex: Option[String]  = excludeFilters.map(_.mkString("(?i).*(", "|", ").*"))
    val includeFiltersRegex: Option[String] = includeFilters.map(_.mkString("(?i).*(", "|", ").*"))

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
