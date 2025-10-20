package ebayapp.core.domain

import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria, SellPrice}
import ebayapp.kernel.types.EnumType
import pureconfig.generic.derivation.EnumConfigReader

import java.time.Instant

final case class SearchParams(
    kind: Option[ItemKind] = None,
    skip: Option[Int] = None,
    limit: Option[Int] = None,
    from: Option[Instant] = None,
    to: Option[Instant] = None,
    query: Option[String] = None
)

enum ItemKind derives EnumConfigReader:
  case Generic
  case VideoGame
  case MobilePhone
  case Clothing
  case Electronics

object ItemKind extends EnumType[ItemKind](() => ItemKind.values)

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

  def electronics(
      itemDetails: ItemDetails.Electronics,
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

