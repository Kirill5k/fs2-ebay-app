package ebayapp.core.repositories

import ebayapp.core.domain.ItemDetails
import ebayapp.core.domain.search.ListingDetails
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY
import org.mongodb.scala.bson.ObjectId
import org.mongodb.scala.bson.codecs.Macros._

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

    val videoGameCodec = fromRegistries(
      fromProviders(
        classOf[ResellableItemEntity],
        classOf[ItemDetails],
        classOf[ListingDetails],
        classOf[ItemPrice]
      ),
      DEFAULT_CODEC_REGISTRY
    )
  }
}
