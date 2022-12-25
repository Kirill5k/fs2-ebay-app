package ebayapp.core.clients.cex

import ebayapp.core.clients.ItemMapper

import java.time.Instant
import ebayapp.core.clients.cex.responses.{CexGraphqlItem, CexItem}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria, SellPrice}

private[cex] object mappers {

  type CexGraphqlItemMapper = ItemMapper[CexGraphqlItem]

  val cexGraphqlGenericItemMapper: CexGraphqlItemMapper = new CexGraphqlItemMapper {
    override def toDomain(foundWith: SearchCriteria)(item: CexGraphqlItem): ResellableItem =
      ResellableItem.generic(
        ItemDetails.Generic(item.boxName),
        ListingDetails(
          s"https://uk.webuy.com/product-detail/?id=${item.boxId}",
          item.boxName,
          Some(item.categoryFriendlyName),
          None,
          None,
          None,
          s"USED / ${item.boxName.last}",
          Instant.now,
          "CEX",
          Map(
            "exchangePerc"     -> item.exchangePerc.toString,
            "firstPrice"       -> item.firstPrice.toString,
            "previousPrice"    -> item.previousPrice.toString,
            "priceLastChanged" -> item.priceLastChanged
          )
        ),
        BuyPrice(item.ecomQuantity, item.sellPrice),
        Some(SellPrice(item.cashPriceCalculated, item.exchangePriceCalculated)),
        foundWith
      )
  }

  type CexItemMapper = ItemMapper[CexItem]

  val cexGenericItemMapper: CexItemMapper = new CexItemMapper {
    override def toDomain(foundWith: SearchCriteria)(sr: CexItem): ResellableItem =
      ResellableItem.generic(
        ItemDetails.Generic(sr.boxName),
        listingDetails(sr),
        price(sr),
        Some(resellPrice(sr)),
        foundWith
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
