package ebayapp.core.clients.frasers

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.frasers.responses.FlannelsProduct
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}
import ebayapp.core.domain.{search, ItemDetails, ResellableItem}

import java.time.Instant

private[frasers] object mappers {

  final case class FlannelsItem(
      product: FlannelsProduct,
      size: String
  )

  type FlannelsItemMapper = ItemMapper[FlannelsItem]

  inline def flannelsClothingMapper: FlannelsItemMapper = new FlannelsItemMapper {

    override def toDomain(foundWith: search.SearchCriteria)(item: FlannelsItem): ResellableItem =
      ResellableItem.clothing(
        ItemDetails.Clothing(s"${item.product.name} (${item.product.colour})", item.product.brand, item.size),
        ListingDetails(
          s"https://flannels.com${item.product.url}",
          item.product.imageAltText,
          None,
          None,
          None,
          item.product.imageLarge,
          "NEW",
          Instant.now,
          "FLANNELS",
          Map.empty
        ),
        BuyPrice(1, item.product.priceUnFormatted, item.product.discountPercentage.map(_.toInt)),
        None,
        foundWith
      )
  }
}
