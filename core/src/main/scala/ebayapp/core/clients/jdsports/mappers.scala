package ebayapp.core.clients.jdsports

import ebayapp.core.clients.ItemMapper
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}
import ebayapp.core.domain.{ItemDetails, ResellableItem}

import java.time.Instant

private[jdsports] object mappers {

  final case class JdsportsItem(
      id: String,
      name: String,
      currentPrice: BigDecimal,
      previousPrice: Option[BigDecimal],
      brand: String,
      colour: String,
      size: String,
      image: String,
      category: String
  ) {
    val fullName: String = s"$colour-$name"
      .replaceAll(" ", "-")
      .replaceAll("-+", "-")
      .replaceAll("/|\'", "")
      .toLowerCase
  }

  type JdsportsItemMapper = ItemMapper[JdsportsItem]

  val jdsportsClothingMapper: JdsportsItemMapper = new JdsportsItemMapper {
    override def toDomain(jdi: JdsportsItem): ResellableItem =
      ResellableItem.clothing(itemDetails(jdi), listingDetails(jdi), buyPrice(jdi), None)

    private def itemDetails(jdi: JdsportsItem): ItemDetails.Clothing =
      Clothing(
        s"${jdi.name} (${jdi.colour}, ${jdi.id})",
        jdi.brand,
        jdi.size
      )

    private def buyPrice(jdi: JdsportsItem): BuyPrice = {
      val current  = jdi.currentPrice
      val rrp = jdi.previousPrice
      val discount = rrp.map(current * 100 / _).map(100 - _.toInt)
      BuyPrice(1, current, discount)
    }

    private def listingDetails(jdi: JdsportsItem): ListingDetails =
      ListingDetails(
        s"https://www.jdsports.co.uk/product/${jdi.fullName}/${jdi.id}/",
        s"${jdi.name} (${jdi.colour} / ${jdi.size})",
        Some(jdi.category),
        None,
        None,
        Some(jdi.image),
        "NEW",
        Instant.now,
        "JDSPORTS",
        Map()
      )
  }
}
