package ebayapp.core.domain

import pureconfig.*
import pureconfig.generic.derivation.default.*
import io.circe.Codec

import java.time.Instant

object search {

  final case class Filters(
      minDiscount: Option[Int] = None,
      exclude: Option[List[String]] = None,
      include: Option[List[String]] = None,
      maxPrice: Option[BigDecimal] = None
  ) derives ConfigReader, Codec.AsObject {
    val excludeRegex: Option[String] = exclude.map(_.mkString("(?i).*(", "|", ").*"))
    val includeRegex: Option[String] = include.map(_.mkString("(?i).*(", "|", ").*"))

    private def mergeOptWith[A](op1: Option[A], op2: Option[A], f: (A, A) => A): Option[A] =
      (op1, op2) match
        case (Some(v1), Some(v2)) => Some(f(v1, v2))
        case (Some(v), None)      => Some(v)
        case (None, Some(v))      => Some(v)
        case _                    => None

    def mergeWith(anotherLimit: Filters): Filters =
      Filters(
        minDiscount = mergeOptWith(minDiscount, anotherLimit.minDiscount, math.max),
        exclude = mergeOptWith(exclude, anotherLimit.exclude, _ ::: _),
        include = mergeOptWith(include, anotherLimit.include, _ ::: _),
        maxPrice = mergeOptWith(maxPrice, anotherLimit.maxPrice, _.min(_))
      )

    def apply(ri: ResellableItem): Boolean = {
      val name = ri.itemDetails.fullName
      name.isDefined &&
        maxPrice.fold(true)(max => ri.buyPrice.rrp < max) &&
        minDiscount.fold(true)(min => ri.buyPrice.discount.exists(_ >= min)) &&
        excludeRegex.fold(true)(filter => !name.get.matches(filter)) &&
        includeRegex.fold(true)(filter => name.get.matches(filter))
    }
  }

  final case class SearchCriteria(
      query: String,
      category: Option[String] = None,
      itemKind: Option[ItemKind] = None,
      minDiscount: Option[Int] = None,
      filters: Option[Filters] = None
  ) derives ConfigReader, Codec.AsObject

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
