package ebayapp.clients.cex

import ebayapp.clients.ItemMapper

import java.time.Instant
import ebayapp.clients.cex.CexClient.SearchResult
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.search.{BuyPrice, ListingDetails, SellPrice}

object mappers {

  trait CexItemMapper[D <: ItemDetails] extends ItemMapper[SearchResult, D] {
    def toDomain(sr: SearchResult): ResellableItem[D]
  }

  implicit val genericItemMapper: CexItemMapper[ItemDetails.Generic] = new CexItemMapper[ItemDetails.Generic] {
    override def toDomain(sr: SearchResult): ResellableItem[ItemDetails.Generic] =
      ResellableItem[ItemDetails.Generic](
        ItemDetails.Generic(sr.boxName),
        listingDetails(sr),
        price(sr),
        Some(resellPrice(sr))
      )
  }

  private def price(sr: SearchResult): BuyPrice =
    BuyPrice(sr.ecomQuantityOnHand, sr.sellPrice)

  private def resellPrice(sr: SearchResult): SellPrice =
    SellPrice(sr.cashPrice, sr.exchangePrice)

  private def listingDetails(sr: SearchResult): ListingDetails =
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
