package ebayapp.core.clients.cex

import ebayapp.core.clients.ItemMapper

import java.time.Instant
import ebayapp.core.clients.cex.responses.CexItem
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria, SellPrice}

private[cex] object mappers {

  type CexItemMapper = ItemMapper[CexItem]

  val cexGenericItemMapper: CexItemMapper = new CexItemMapper {
    override def toDomain(foundWith: SearchCriteria)(sr: CexItem): ResellableItem =
      ResellableItem.generic(
        ItemDetails.Generic(sr.boxName),
        listingDetails(sr),
        price(sr),
        Some(resellPrice(sr)),
        Some(foundWith)
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
