package ebayapp.core.clients.argos

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.argos.responses.ArgosItem
import ebayapp.core.domain.ItemDetails.Generic
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}
import ebayapp.core.domain.ResellableItem

import java.time.Instant

private[argos] object mappers {

  type ArgosItemMapper = ItemMapper[ArgosItem]
  object ArgosItemMapper {
    val generic: ArgosItemMapper = new ArgosItemMapper {
      override def toDomain(foundWith: SearchCriteria)(data: ArgosItem): ResellableItem =
        ResellableItem.generic(
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
            "Argos",
            Map()
          ),
          BuyPrice(1, data.attributes.price),
          None,
          foundWith
        )
    } 
  }
}
