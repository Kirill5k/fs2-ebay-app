package ebayapp.clients.argos

import ebayapp.clients.ItemMapper
import ebayapp.clients.argos.responses.ResponseData
import ebayapp.domain.ItemDetails.Generic
import ebayapp.domain.search.{BuyPrice, ListingDetails}
import ebayapp.domain.{ItemDetails, ResellableItem}

import java.time.Instant

object mappers {

  trait ArgosItemMapper[D <: ItemDetails] extends ItemMapper[ResponseData, D] {
    def toDomain(data: ResponseData): ResellableItem[D]
  }

  implicit def argosGeneric: ArgosItemMapper[ItemDetails.Generic] = new ArgosItemMapper[ItemDetails.Generic] {

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
