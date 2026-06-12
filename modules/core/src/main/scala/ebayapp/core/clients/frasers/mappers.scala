package ebayapp.core.clients.frasers

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.frasers.responses.FrasersProduct
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}
import ebayapp.core.domain.{search, ItemDetails, ResellableItem}

import java.time.Instant

private[frasers] object mappers {

  final case class FrasersItem(
      product: FrasersProduct,
      size: String,
      websiteUri: String,
      retailer: String
  )

  type FrasersItemMapper = ItemMapper[FrasersItem]
  object FrasersItemMapper {
    val clothing: FrasersItemMapper = new FrasersItemMapper {
      override def toDomain(foundWith: search.SearchCriteria)(item: FrasersItem): ResellableItem =
        ResellableItem.clothing(
          ItemDetails.Clothing(
            s"${item.product.name.cut(item.product.brand)} (${item.product.colour})",
            item.product.brand.capitalizeAll,
            formatSize(item.size)
          ),
          ListingDetails(
            s"${item.websiteUri}/${item.product.productUrl}",
            item.product.name,
            None,
            None,
            None,
            Some(item.product.image),
            "NEW",
            Instant.now,
            item.retailer.capitalizeAll,
            Map.empty
          ),
          BuyPrice(1, item.product.discountedPrice.getOrElse(item.product.price), item.product.discount),
          None,
          foundWith
        )
    }
  }
}
