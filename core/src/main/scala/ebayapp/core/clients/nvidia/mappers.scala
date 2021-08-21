package ebayapp.core.clients.nvidia

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.nvidia.responses.{NvidiaItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}
import ebayapp.core.domain.{ItemDetails, ResellableItem}

import java.time.Instant

private[nvidia] object mappers {

  type NvidiaItemMapper = ItemMapper[NvidiaItem]

  val nvidiaGenericItemMapper: NvidiaItemMapper = new NvidiaItemMapper {
    override def toDomain(item: NvidiaItem): ResellableItem =
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
          s"NVIDIA/${item.retailer.retailerName}",
          Map.empty[String, String]
        ),
        BuyPrice(item.retailer.stock, item.retailer.salePrice),
        None
      )
  }
}
