package ebayapp.core.clients.frasers

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.frasers.responses.FlannelsProduct
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}
import ebayapp.core.domain.{search, ItemDetails, ResellableItem}

import java.time.Instant

private[frasers] object mappers {

  final case class FrasersItem(
      product: FlannelsProduct,
      size: String,
      websiteUri: String,
      retailer: String
  )

  type FrasersItemMapper = ItemMapper[FrasersItem]

  inline def frasers: FrasersItemMapper = new FrasersItemMapper {

    private def formatSize(size: String): String =
      size
        .replaceFirst("(?i)medium", "M")
        .replaceFirst("(?i)small", "S")
        .replaceFirst("(?i)large", "L")
        .replaceFirst("(?i)(?<=^([X]+|\\dX)) ", "")

    override def toDomain(foundWith: search.SearchCriteria)(item: FrasersItem): ResellableItem =
      ResellableItem.clothing(
        ItemDetails.Clothing(
          s"${item.product.name.replaceAll("(?i)" + item.product.brand, "").trimmed} (${item.product.colour})",
          item.product.brand,
          formatSize(item.size)
        ),
        ListingDetails(
          s"${item.websiteUri}${item.product.url}",
          item.product.imageAltText,
          None,
          None,
          None,
          item.product.imageLarge,
          "NEW",
          Instant.now,
          item.retailer.toUpperCase,
          Map.empty
        ),
        BuyPrice(1, item.product.priceUnFormatted, item.product.discountPercentage.map(_.toInt)),
        None,
        foundWith
      )
  }
}
