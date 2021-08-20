package ebayapp.core.domain

import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SellPrice}

sealed trait ItemKind
object ItemKind {
  case object Generic     extends ItemKind
  case object VideoGame   extends ItemKind
  case object MobilePhone extends ItemKind
  case object Clothing    extends ItemKind
}

final case class ResellableItem[D <: ItemDetails](
    itemDetails: D,
    listingDetails: ListingDetails,
    buyPrice: BuyPrice,
    sellPrice: Option[SellPrice]
)

object ResellableItem {
  type Anything = ResellableItem[_ <: ItemDetails]

  type GenericItem = ResellableItem[ItemDetails.Generic]
  type VideoGame   = ResellableItem[ItemDetails.Game]
  type MobilePhone = ResellableItem[ItemDetails.Phone]
  type Clothing    = ResellableItem[ItemDetails.Clothing]
}
