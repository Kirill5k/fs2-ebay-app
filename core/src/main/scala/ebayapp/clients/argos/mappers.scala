package ebayapp.clients.argos

import ebayapp.clients.argos.responses.ResponseData
import ebayapp.domain.ItemDetails.Generic
import ebayapp.domain.search.{BuyPrice, ListingDetails}
import ebayapp.domain.{ItemDetails, ResellableItem}

import java.time.Instant

private[argos] object mappers {

  trait ArgosItemMapper[D <: ItemDetails] {
    def toDomain(data: ResponseData): ResellableItem[D]
  }

  implicit def generic: ArgosItemMapper[ItemDetails.Generic] = new ArgosItemMapper[ItemDetails.Generic] {

    override def toDomain(data: ResponseData): ResellableItem[ItemDetails.Generic] =
      ResellableItem[ItemDetails.Generic](
        Generic(data.attributes.name),
        ListingDetails(
          s"https://www.argos.co.uk/product/${data.id}",
          data.attributes.name,
          Some(data.attributes.brand),
          None,
          None,
          None,
          "NEW",
          Instant.now,
          "ARGOS",
          Map()
        ),
        BuyPrice(1, data.attributes.price),
        None
      )
  }
}
