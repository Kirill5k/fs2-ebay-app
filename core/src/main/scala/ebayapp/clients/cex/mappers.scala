package ebayapp.clients.cex

import java.time.Instant

import ebayapp.clients.cex.CexClient.SearchResult
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.search.{ListingDetails, Price, ResellPrice}

object mappers {

  trait CexItemMapper[D <: ItemDetails] {
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

  private def price(sr: SearchResult): Price =
    Price(sr.ecomQuantityOnHand, sr.sellPrice)

  private def resellPrice(sr: SearchResult): ResellPrice =
    ResellPrice(sr.cashPrice, sr.exchangePrice)

  private def listingDetails(sr: SearchResult): ListingDetails =
    ListingDetails(
      s"https://uk.webuy.com/product-detail/?id=${sr.boxId}",
      sr.boxName,
      Some(sr.categoryName),
      None,
      None,
      s"USED / ${sr.boxName.last}",
      Instant.now,
      "CEX",
      Map()
    )
}
