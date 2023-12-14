package ebayapp.core.domain

import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria, SellPrice}
import io.circe.{Codec, Decoder, Encoder}
import pureconfig.generic.derivation.EnumConfigReader

import scala.util.Try

enum ItemKind derives EnumConfigReader:
  case Generic
  case VideoGame
  case MobilePhone
  case Clothing

object ItemKind:
  
  def fromStringRepr(stringRepr: String): Either[Throwable, ItemKind] =
    Try(ItemKind.valueOf(stringRepr.split("-").map(_.capitalize).mkString)).toEither
  
  extension (ik: ItemKind)
    def stringRepr: String = ik.toString.replaceAll("(?<=[a-z])(?=[A-Z])", "-").toLowerCase
  
  inline given Decoder[ItemKind] = Decoder[String].emap(ItemKind.fromStringRepr(_).left.map(_.getMessage))
  inline given Encoder[ItemKind] = Encoder[String].contramap(_.stringRepr)

final case class ItemSummary(
    name: Option[String],
    title: String,
    url: String,
    buyPrice: BigDecimal,
    exchangePrice: Option[BigDecimal]
) derives Codec.AsObject

final case class ResellableItem(
    itemDetails: ItemDetails,
    listingDetails: ListingDetails,
    buyPrice: BuyPrice,
    sellPrice: Option[SellPrice],
    foundWith: SearchCriteria
) {
  def summary: ItemSummary =
    ItemSummary(
      itemDetails.fullName,
      listingDetails.title,
      listingDetails.url,
      buyPrice.rrp,
      sellPrice.map(_.credit)
    )
}

object ResellableItem {
  def generic(
      itemDetails: ItemDetails.Generic,
      listingDetails: ListingDetails,
      buyPrice: BuyPrice,
      sellPrice: Option[SellPrice],
      foundWith: SearchCriteria
  ): ResellableItem =
    ResellableItem(
      itemDetails,
      listingDetails,
      buyPrice,
      sellPrice,
      foundWith
    )

  def videoGame(
      itemDetails: ItemDetails.VideoGame,
      listingDetails: ListingDetails,
      buyPrice: BuyPrice,
      sellPrice: Option[SellPrice],
      foundWith: SearchCriteria
  ): ResellableItem =
    ResellableItem(
      itemDetails,
      listingDetails,
      buyPrice,
      sellPrice,
      foundWith
    )

  def clothing(
      itemDetails: ItemDetails.Clothing,
      listingDetails: ListingDetails,
      buyPrice: BuyPrice,
      sellPrice: Option[SellPrice],
      foundWith: SearchCriteria
  ): ResellableItem =
    ResellableItem(
      itemDetails,
      listingDetails,
      buyPrice,
      sellPrice,
      foundWith
    )

  def mobilePhone(
      itemDetails: ItemDetails.Phone,
      listingDetails: ListingDetails,
      buyPrice: BuyPrice,
      sellPrice: Option[SellPrice],
      foundWith: SearchCriteria
  ): ResellableItem =
    ResellableItem(
      itemDetails,
      listingDetails,
      buyPrice,
      sellPrice,
      foundWith
    )
}
