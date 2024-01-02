package ebayapp.core.domain

import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria, SellPrice}
import ebayapp.kernel.types.EnumType
import io.circe.{Codec, Decoder, Encoder}
import pureconfig.generic.derivation.EnumConfigReader

enum ItemKind derives EnumConfigReader:
  case Generic
  case VideoGame
  case MobilePhone
  case Clothing

object ItemKind extends EnumType[ItemKind](() => ItemKind.values)

final case class ResellableItemSummary(
    itemDetails: ItemDetails,
    listingTitle: String,
    listingUrl: String,
    buyPrice: BigDecimal,
    exchangePrice: Option[BigDecimal]
) derives Codec.AsObject

final case class ResellableItem(
    itemDetails: ItemDetails,
    listingDetails: ListingDetails,
    buyPrice: BuyPrice,
    sellPrice: Option[SellPrice],
    foundWith: SearchCriteria
)

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
