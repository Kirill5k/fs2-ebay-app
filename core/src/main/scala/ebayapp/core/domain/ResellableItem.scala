package ebayapp.core.domain

import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SellPrice}

final case class ResellableItem[D <: ItemDetails](
    itemDetails: D,
    listingDetails: ListingDetails,
    buyPrice: BuyPrice,
    sellPrice: Option[SellPrice]
)

object ResellableItem {
  type GenericItem = ResellableItem[ItemDetails.Generic]
  type VideoGame   = ResellableItem[ItemDetails.Game]
  type MobilePhone = ResellableItem[ItemDetails.Phone]
  type Clothe      = ResellableItem[ItemDetails.Clothing]
}
