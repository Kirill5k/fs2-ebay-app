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
      .replaceAll("/|\'", "")
      .toLowerCase
  }

  type JdsportsItemMapper = ItemMapper[JdsportsItem]

  val jdsportsClothingMapper: JdsportsItemMapper = new JdsportsItemMapper {
    override def toDomain(foundWith: SearchCriteria)(jdi: JdsportsItem): ResellableItem =
      ResellableItem.clothing(itemDetails(jdi), listingDetails(jdi), buyPrice(jdi), None, foundWith)

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
        s"${jdi.storeUrl}product/${jdi.fullName}/${jdi.id}/",
        s"${jdi.name} (${jdi.colour} / ${jdi.size})",
        Some(jdi.category),
        None,
        None,
        Some(jdi.image),
        "NEW",
        Instant.now,
        jdi.storeName.toUpperCase,
        Map.empty
      )
  }
}
