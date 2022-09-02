package ebayapp.core.clients.argos

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.argos.responses.ArgosItem
import ebayapp.core.domain.ItemDetails.Generic
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}
import ebayapp.core.domain.ResellableItem

import java.time.Instant

private[argos] object mappers {

  type ArgosItemMapper = ItemMapper[ArgosItem]

  val argosGenericItemMapper: ArgosItemMapper = new ArgosItemMapper {
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
          "ARGOS",
          Map()
        ),
        BuyPrice(1, data.attributes.price),
        None,
        Some(foundWith)
      )
  }
}
