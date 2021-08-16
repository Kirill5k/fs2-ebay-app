package ebayapp.core.clients.scan

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.scan.parsers.ScanItem
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}

import java.time.Instant

private[scan] object mappers {

  type ScanItemMapper[D <: ItemDetails] = ItemMapper[ScanItem, D]

  implicit val scanaGenericItemMapper: ScanItemMapper[ItemDetails.Generic] = new ScanItemMapper[ItemDetails.Generic] {
    override def toDomain(item: ScanItem): ResellableItem[ItemDetails.Generic] =
      ResellableItem[ItemDetails.Generic](
        ItemDetails.Generic(item.name),
        ListingDetails(
          s"https://scan.co.uk${item.productUrlPath}",
          item.name,
          Some("HARDWARE"),
          None,
          None,
          Some(item.imageUrl),
          "NEW",
          Instant.now(),
          s"SCAN.CO.UK",
          Map.empty[String, String]
        ),
        BuyPrice(1, BigDecimal(item.price)),
        None
      )
  }
}
