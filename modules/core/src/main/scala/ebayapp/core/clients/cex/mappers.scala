package ebayapp.core.clients.cex

import ebayapp.core.clients.ItemMapper

import java.time.Instant
import ebayapp.core.clients.cex.responses.{CexGraphqlItem, CexItem}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria, SellPrice}

private[cex] object mappers {

  type CexGraphqlItemMapper = ItemMapper[CexGraphqlItem]
  object CexGraphqlItemMapper {
    val generic: CexGraphqlItemMapper = new CexGraphqlItemMapper {
      override def toDomain(foundWith: SearchCriteria)(item: CexGraphqlItem): ResellableItem =
        ResellableItem.generic(
          ItemDetails.Generic(item.boxName),
          ListingDetails(
            s"https://uk.webuy.com/product-detail/?id=${item.boxId}",
            item.boxName,
            Some(item.categoryFriendlyName),
            None,
            None,
            item.imageUrl,
            s"USED${item.Grade.flatMap(_.headOption).map(g => s" / ${g}").getOrElse("")}",
            Instant.now,
            "CEX",
            List(
              item.ecomQuantity.map(q => "ecomQuantity" -> q.noSpaces),
              Some("exchangePerc" -> item.exchangePerc.toString),
              item.firstPrice.map(fp => "firstPrice" -> fp.toString()),
              item.previousPrice.map(pp => "previousPrice" -> pp.toString()),
              item.priceLastChanged.map(plc => "priceLastChanged" -> plc)
            ).flatten.toMap
          ),
          BuyPrice(item.quantityAvailable.getOrElse(0), item.sellPrice),
          Some(SellPrice(item.cashPriceCalculated, item.exchangePriceCalculated)),
          foundWith
        )
    }
  }

  type CexItemMapper = ItemMapper[CexItem]
  object CexItemMapper {
    val generic: CexItemMapper = new CexItemMapper {
      override def toDomain(foundWith: SearchCriteria)(sr: CexItem): ResellableItem =
        ResellableItem.generic(
          ItemDetails.Generic(sr.boxName),
          listingDetails(sr),
          price(sr),
          Some(resellPrice(sr)),
          foundWith
        )
    }
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
