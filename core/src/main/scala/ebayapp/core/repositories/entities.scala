package ebayapp.core.repositories

import ebayapp.core.domain.ItemDetails
import ebayapp.core.domain.search.ListingDetails
import org.mongodb.scala.bson.ObjectId

private[repositories] object entities {

  final case class ItemPrice(
      buy: String,
      quantityAvailable: Int,
      sell: Option[String],
      credit: Option[String]
  )

  sealed trait ResellableItemEntity

  object ResellableItemEntity {

    final case class VideoGame(
        _id: ObjectId,
        itemDetails: ItemDetails.Game,
        listingDetails: ListingDetails,
        price: ItemPrice
    ) extends ResellableItemEntity
  }
}
