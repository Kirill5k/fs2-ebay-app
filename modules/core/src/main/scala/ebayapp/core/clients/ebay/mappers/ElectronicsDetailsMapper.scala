package ebayapp.core.clients.ebay.mappers

import ebayapp.core.domain.ItemDetails.Electronics
import ebayapp.core.domain.search.ListingDetails

private[mappers] object ElectronicsDetailsMapper {
  
  def from(listingDetails: ListingDetails): Electronics =
    Electronics(
      brand = listingDetails.properties.get(EbayItemMapper.Props.brand),
      model = listingDetails.properties.get(EbayItemMapper.Props.model),
      colour = mapColour(listingDetails),
      condition = Some(listingDetails.condition)
    )

  private def mapColour(listingDetails: ListingDetails): Option[String] =
    listingDetails.properties
      .get(EbayItemMapper.Props.manColour)
      .orElse(listingDetails.properties.get(EbayItemMapper.Props.colour))
}
