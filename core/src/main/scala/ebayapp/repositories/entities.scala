package ebayapp.repositories

import ebayapp.domain.ItemDetails
import ebayapp.domain.search.{ListingDetails, Price, ResellPrice}
import org.mongodb.scala.bson.ObjectId
import org.mongodb.scala.bson.codecs.Macros._
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.mongodb.scala.MongoClient.DEFAULT_CODEC_REGISTRY

private[repositories] object entities {

  final case class ResellableItemEntity[D <: ItemDetails](
      _id: Option[ObjectId],
      itemDetails: D,
      listingDetails: ListingDetails,
      price: Price,
      resellPrice: Option[ResellPrice]
  )

  object ResellableItemEntity {
    type VideoGame = ResellableItemEntity[ItemDetails.Game]

    val videoGameCodec = fromRegistries(
      fromProviders(classOf[ResellableItemEntity[ItemDetails.Game]]),
      fromProviders(classOf[ListingDetails]),
      fromProviders(classOf[ResellPrice]),
      DEFAULT_CODEC_REGISTRY
    )
  }
}
