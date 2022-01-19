package ebayapp.core.domain

import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SellPrice}
import io.circe.{Codec, Decoder, Encoder}
import pureconfig.generic.derivation.EnumConfigReader

import scala.util.Try

enum ItemKind derives EnumConfigReader:
  case Generic
  case VideoGame
  case MobilePhone
  case Clothing

object ItemKind {

  inline given decode: Decoder[ItemKind] =
    Decoder[String].emapTry(s => Try(ItemKind.valueOf(s.split("-").map(_.capitalize).mkString)))
  inline given encode: Encoder[ItemKind] =
    Encoder[String].contramap(_.toString.replaceAll("(?<=[a-z])(?=[A-Z])", "-").toLowerCase)
}

final case class ItemSummary(
    name: Option[String],
    title: String,
    url: String,
    buyPrice: BigDecimal,
    exchangePrice: Option[BigDecimal]
) derives Codec.AsObject

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
