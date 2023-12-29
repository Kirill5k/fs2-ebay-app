package ebayapp.core.clients.nvidia

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.nvidia.responses.NvidiaItem
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}
import ebayapp.core.domain.{ItemDetails, ResellableItem}

import java.time.Instant

private[nvidia] object mappers {

  type NvidiaItemMapper = ItemMapper[NvidiaItem]
  object NvidiaItemMapper {
    val generic: NvidiaItemMapper = new NvidiaItemMapper {
      override def toDomain(foundWith: SearchCriteria)(item: NvidiaItem): ResellableItem =
        ResellableItem.generic(
          ItemDetails.Generic(item.name),
          ListingDetails(
            item.retailer.directPurchaseLink.getOrElse(item.retailer.purchaseLink),
            item.productTitle,
            Some(item.category),
            None,
            None,
            Some(item.imageURL),
            "NEW",
            Instant.now(),
            "Nvidia",
            Map("retailer" -> item.retailer.retailerName)
          ),
          BuyPrice(item.retailer.stock + 1, item.retailer.salePrice),
          None,
          foundWith
        )
    }
  }
}
