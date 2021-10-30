package ebayapp.core.repositories

import ebayapp.core.domain.{ItemDetails, ItemKind}
import ebayapp.core.domain.search.ListingDetails
import org.bson.types.ObjectId

private[repositories] object entities {

  final case class ItemPrice(
      buy: BigDecimal,
      quantityAvailable: Int,
      sell: Option[BigDecimal],
      credit: Option[BigDecimal]
  )

  final case class ResellableItemEntity(
      _id: ObjectId,
      kind: ItemKind,
      itemDetails: ItemDetails,
      listingDetails: ListingDetails,
      price: ItemPrice
  )
}
