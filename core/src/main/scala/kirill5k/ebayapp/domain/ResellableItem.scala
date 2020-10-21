package kirill5k.ebayapp.domain

import kirill5k.ebayapp.domain.search.{ListingDetails, Price, ResellPrice}

final case class ResellableItem[D <: ItemDetails](
    itemDetails: D,
    listingDetails: ListingDetails,
    price: Price,
    resellPrice: Option[ResellPrice]
)

object ResellableItem {
  type GenericItem = ResellableItem[ItemDetails.Generic]
  type VideoGame   = ResellableItem[ItemDetails.Game]
  type MobilePhone = ResellableItem[ItemDetails.Phone]
}
