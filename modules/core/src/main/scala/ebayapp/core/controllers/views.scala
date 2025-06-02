package ebayapp.core.controllers

import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.domain.search.ListingDetails
import io.circe.{Codec, Encoder}

object views {

  final case class ResellableItemStats(
      total: Int,
  ) derives Codec.AsObject

  final case class ItemPrice(
      buy: BigDecimal,
      discount: Option[Int],
      quantityAvailable: Int,
      sell: Option[BigDecimal],
      credit: Option[BigDecimal]
  ) derives Codec.AsObject

  final case class ResellableItemView(
      itemDetails: ItemDetails,
      listingDetails: ListingDetails,
      price: ItemPrice,
      foundWith: String
  ) derives Codec.AsObject

  object ResellableItemView {
    def from(item: ResellableItem): ResellableItemView =
      ResellableItemView(
        item.itemDetails,
        item.listingDetails,
        ItemPrice(
          item.buyPrice.rrp,
          item.buyPrice.discount,
          item.buyPrice.quantityAvailable,
          item.sellPrice.map(_.cash),
          item.sellPrice.map(_.credit)
        ),
        item.foundWith.query
      )
  }
}
