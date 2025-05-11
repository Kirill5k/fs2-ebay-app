package ebayapp.core.clients.harveynichols

import ebayapp.core.clients.ItemMapper
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}

import java.time.Instant

private[harveynichols] object mappers {

  final case class HarveyNicholsItem(
      name: String,
      brand: String,
      size: String,
      currentPrice: Double,
      originalPrice: Double,
      discount: Option[Double],
      itemUrl: String,
      imageUrl: String
  )

  type HarveyNicholsItemMapper = ItemMapper[HarveyNicholsItem]
  object HarveyNicholsItemMapper {
    val clothing: HarveyNicholsItemMapper = new HarveyNicholsItemMapper {
      override def toDomain(foundWith: SearchCriteria)(hni: HarveyNicholsItem): ResellableItem =
        ResellableItem.clothing(
          Clothing(
            hni.name.replaceAll("(?i)" + hni.brand, "").trimmed,
            hni.brand.capitalizeAll,
            formatSize(hni.size)
          ),
          listingDetails(hni),
          BuyPrice(1, BigDecimal(hni.currentPrice), hni.discount.map(_.toInt)),
          None,
          foundWith
        )

      private def listingDetails(hni: HarveyNicholsItem): ListingDetails =
        ListingDetails(
          s"https://www.harveynichols.com/${hni.itemUrl}",
          hni.name,
          None,
          None,
          None,
          Some(hni.imageUrl),
          s"NEW",
          Instant.now,
          "Harvey Nichols",
          Map.empty
        )
    }
  }
}
