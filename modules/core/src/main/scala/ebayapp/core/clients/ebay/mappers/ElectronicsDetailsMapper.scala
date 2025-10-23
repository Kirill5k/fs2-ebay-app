package ebayapp.core.clients.ebay.mappers

import ebayapp.core.domain.ItemDetails.Electronics
import ebayapp.core.domain.search.ListingDetails

private[mappers] object ElectronicsDetailsMapper {
  
  def from(listing: ListingDetails): Electronics =
    Electronics(
      brand = listing.properties.get(EbayItemMapper.Props.brand),
      model = listing.properties.get(EbayItemMapper.Props.model),
      colour = mapColour(listing),
      condition = mapCondition(listing)
    )

  private def mapCondition(listing: ListingDetails): Option[String] =
    val originalCondition = Some(listing.condition)
    originalCondition
      .filter(_ == "New")
      .orElse(listing.properties.get(EbayItemMapper.Props.productGrade))
      .orElse(listing.properties.get(EbayItemMapper.Props.gradeOfProduct))
      .orElse(originalCondition)
  
  private def mapColour(listing: ListingDetails): Option[String] =
    listing.properties
      .get(EbayItemMapper.Props.manColour)
      .orElse(listing.properties.get(EbayItemMapper.Props.colour))
}
