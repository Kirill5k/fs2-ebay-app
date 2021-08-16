package ebayapp.core.clients.argos

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.argos.responses.ArgosItem
import ebayapp.core.domain.ItemDetails.Generic
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}
import ebayapp.core.domain.{ItemDetails, ResellableItem}

import java.time.Instant

private[argos] object mappers {

  type ArgosItemMapper[D <: ItemDetails] = ItemMapper[ArgosItem, D]

  implicit val argosGenericItemMapper: ArgosItemMapper[ItemDetails.Generic] = new ArgosItemMapper[ItemDetails.Generic] {

    override def toDomain(data: ArgosItem): ResellableItem[ItemDetails.Generic] =
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
