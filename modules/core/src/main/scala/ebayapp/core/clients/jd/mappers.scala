package ebayapp.core.clients.jd

import ebayapp.core.clients.ItemMapper
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}
import ebayapp.core.domain.{ItemDetails, ResellableItem}

import java.time.Instant

private[jd] object mappers {

  final case class JdsportsItem(
      id: String,
      name: String,
      currentPrice: BigDecimal,
      previousPrice: Option[BigDecimal],
      brand: String,
      colour: String,
      size: String,
      image: String,
      category: String,
      storeUrl: String,
      storeName: String
  ) {
    val fullName: String = s"$colour-$name"
      .replaceAll(" ", "-")
      .replaceAll("-+", "-")
      .replaceAll("/|\'|'", "")
      .toLowerCase
  }

  type JdsportsItemMapper = ItemMapper[JdsportsItem]
  object JdsportsItemMapper {
    val clothing: JdsportsItemMapper = new JdsportsItemMapper {
      override def toDomain(foundWith: SearchCriteria)(jdi: JdsportsItem): ResellableItem =
        ResellableItem.clothing(itemDetails(jdi), listingDetails(jdi), buyPrice(jdi), None, foundWith)

      private def itemDetails(jdi: JdsportsItem): ItemDetails.Clothing = {
        val id = if (jdi.colour.isBlank) jdi.id else s"${jdi.colour.capitalize}, ${jdi.id}"
        Clothing(
          s"${jdi.name.replaceAll("&amp;", "&").replaceAll("(?i)" + jdi.brand, "").trimmed} ($id)",
          jdi.brand.capitalizeAll,
          formatSize(jdi.size)
        )
      }

      private def buyPrice(jdi: JdsportsItem): BuyPrice =
        BuyPrice(1, jdi.currentPrice, discount(jdi.currentPrice, jdi.previousPrice))

      private def listingDetails(jdi: JdsportsItem): ListingDetails =
        ListingDetails(
          s"${jdi.storeUrl}/product/${jdi.fullName}/${jdi.id}/",
          s"${jdi.name} (${jdi.colour} / ${jdi.size})",
          Some(jdi.category),
          None,
          None,
          Some(jdi.image),
          "NEW",
          Instant.now,
          jdi.storeName.capitalizeAll,
          Map.empty
        )
    }
  }
}
