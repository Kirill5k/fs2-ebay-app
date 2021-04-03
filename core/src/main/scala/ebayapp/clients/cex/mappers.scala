package ebayapp.clients.cex

import ebayapp.clients.ItemMapper

import java.time.Instant
import ebayapp.clients.cex.responses.CexItem
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.search.{BuyPrice, ListingDetails, SellPrice}

object mappers {

  type CexItemMapper[D <: ItemDetails] = ItemMapper[CexItem, D]

  implicit val genericItemMapper: CexItemMapper[ItemDetails.Generic] = new CexItemMapper[ItemDetails.Generic] {
    override def toDomain(sr: CexItem): ResellableItem[ItemDetails.Generic] =
      ResellableItem[ItemDetails.Generic](
        ItemDetails.Generic(sr.boxName),
        listingDetails(sr),
        price(sr),
        Some(resellPrice(sr))
      )
  }

  private def price(sr: CexItem): BuyPrice =
    BuyPrice(sr.ecomQuantityOnHand, sr.sellPrice)

  private def resellPrice(sr: CexItem): SellPrice =
    SellPrice(sr.cashPrice, sr.exchangePrice)

  private def listingDetails(sr: CexItem): ListingDetails =
    ListingDetails(
      s"https://uk.webuy.com/product-detail/?id=${sr.boxId}",
      sr.boxName,
      Some(sr.categoryFriendlyName),
      None,
      None,
      None,
      s"USED / ${sr.boxName.last}",
      Instant.now,
      "CEX",
      Map()
    )
}
