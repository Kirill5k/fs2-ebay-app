package ebayapp.clients.jdsports

import ebayapp.clients.ItemMapper
import ebayapp.domain.ItemDetails.Clothing
import ebayapp.domain.search.{BuyPrice, ListingDetails}
import ebayapp.domain.{ItemDetails, ResellableItem}

import java.time.Instant

object mappers {

  final case class JdsportsItem(
      id: String,
      name: String,
      currentPrice: BigDecimal,
      previousPrice: BigDecimal,
      brand: String,
      colour: String,
      size: String,
      image: String,
      category: String
  ) {
    val fullName: String = s"$colour-$name".replaceAll(" ", "-").replaceAll("-+", "-").toLowerCase
  }

  type JdsportsItemMapper[D <: ItemDetails] = ItemMapper[JdsportsItem, D]

  implicit val clothingMapper: JdsportsItemMapper[ItemDetails.Clothing] = new JdsportsItemMapper[ItemDetails.Clothing] {

    override def toDomain(jdi: JdsportsItem): ResellableItem[ItemDetails.Clothing] =
      ResellableItem[ItemDetails.Clothing](
        itemDetails(jdi),
        listingDetails(jdi),
        buyPrice(jdi),
        None
      )

    private def itemDetails(jdi: JdsportsItem): ItemDetails.Clothing =
      Clothing(
        jdi.name,
        jdi.brand,
        jdi.size
      )

    private def buyPrice(jdi: JdsportsItem): BuyPrice = {
      val current  = jdi.currentPrice
      val rrp      = jdi.previousPrice
      val discount = 100 - (current * 100 / rrp).toInt

      BuyPrice(
        1,
        current,
        Some(discount)
      )
    }

    private def listingDetails(jdi: JdsportsItem): ListingDetails =
      ListingDetails(
        s"https://www.jdsports.co.uk/product/${jdi.fullName}/${jdi.id}/",
        s"${jdi.name} (${jdi.colour} / ${jdi.size})",
        Some(jdi.category),
        None,
        None,
        Some(jdi.image),
        s"NEW",
        Instant.now,
        "JDSPORTS",
        Map()
      )
  }
}
