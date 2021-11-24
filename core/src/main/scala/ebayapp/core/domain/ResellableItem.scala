package ebayapp.core.domain

import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SellPrice}
import io.circe.{Decoder, Encoder}
import pureconfig.generic.derivation.EnumConfigReader

enum ItemKind(val value: String) derives EnumConfigReader {
  case Generic     extends ItemKind("generic")
  case VideoGame   extends ItemKind("video-game")
  case MobilePhone extends ItemKind("mobile-phone")
  case Clothing    extends ItemKind("clothing")
}

object ItemKind {

  def from(value: String): Either[String, ItemKind] =
    ItemKind.values.find(_.value == value).toRight(s"unexpected item kind $value")

  implicit val decode: Decoder[ItemKind] = Decoder[String].emap(ItemKind.from)
  implicit val encode: Encoder[ItemKind] = Encoder[String].contramap(_.value)
}

final case class ItemSummary(
    name: Option[String],
    title: String,
    url: String,
    buyPrice: BigDecimal,
    exchangePrice: Option[BigDecimal]
)

final case class ResellableItem(
    kind: ItemKind,
    itemDetails: ItemDetails,
    listingDetails: ListingDetails,
    buyPrice: BuyPrice,
    sellPrice: Option[SellPrice]
)

object ResellableItem {
  def generic(
      itemDetails: ItemDetails.Generic,
      listingDetails: ListingDetails,
      buyPrice: BuyPrice,
      sellPrice: Option[SellPrice]
  ): ResellableItem =
    ResellableItem(
      ItemKind.Generic,
      itemDetails,
      listingDetails,
      buyPrice,
      sellPrice
    )

  def videoGame(
      itemDetails: ItemDetails.VideoGame,
      listingDetails: ListingDetails,
      buyPrice: BuyPrice,
      sellPrice: Option[SellPrice]
  ): ResellableItem =
    ResellableItem(
      ItemKind.VideoGame,
      itemDetails,
      listingDetails,
      buyPrice,
      sellPrice
    )

  def clothing(
      itemDetails: ItemDetails.Clothing,
      listingDetails: ListingDetails,
      buyPrice: BuyPrice,
      sellPrice: Option[SellPrice]
  ): ResellableItem =
    ResellableItem(
      ItemKind.Clothing,
      itemDetails,
      listingDetails,
      buyPrice,
      sellPrice
    )

  def mobilePhone(
      itemDetails: ItemDetails.Phone,
      listingDetails: ListingDetails,
      buyPrice: BuyPrice,
      sellPrice: Option[SellPrice]
  ): ResellableItem =
    ResellableItem(
      ItemKind.MobilePhone,
      itemDetails,
      listingDetails,
      buyPrice,
      sellPrice
    )
}
