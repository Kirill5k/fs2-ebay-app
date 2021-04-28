package ebayapp.core.clients.nvidia

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.nvidia.responses.NvidiaItem
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}
import ebayapp.core.domain.{ItemDetails, ResellableItem}

import java.time.Instant

object mappers {

  type NvidiaItemMapper[D <: ItemDetails] = ItemMapper[NvidiaItem, D]

  implicit val genericItemMapper: NvidiaItemMapper[ItemDetails.Generic] = new NvidiaItemMapper[ItemDetails.Generic] {
    override def toDomain(item: NvidiaItem): ResellableItem[ItemDetails.Generic] =
      ResellableItem[ItemDetails.Generic](
        ItemDetails.Generic(s"${item.productTitle} (${item.productID})"),
        ListingDetails(
          item.retailers.map(r => r.directPurchaseLink.getOrElse(r.purchaseLink)).head,
          item.productTitle,
          Some(item.category),
          None,
          None,
          Some(item.imageURL),
          "NEW",
          Instant.now(),
          "NVIDIA",
          Map.empty[String, String]
        ),
        BuyPrice(1, BigDecimal(item.productPrice.replaceAll("£|,", ""))),
        None
      )
  }
}
