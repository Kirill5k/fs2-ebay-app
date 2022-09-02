package ebayapp.core.clients.harveynichols

import ebayapp.core.clients.ItemMapper
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}

import java.time.Instant

private[harveynichols] object mappers {

  final case class HarveyNicholsItem(
      name: String,
      brand: String,
      size: String,
      currentPrice: Int,
      originalPrice: Int,
      discount: Option[Int],
      itemUrl: String,
      imageUrl: String
  )

  type HarveyNicholsItemMapper = ItemMapper[HarveyNicholsItem]

  inline def harveyNicholsClothingMapper: HarveyNicholsItemMapper = new HarveyNicholsItemMapper {

    override def toDomain(foundWith: SearchCriteria)(hni: HarveyNicholsItem): ResellableItem =
      ResellableItem.clothing(
        Clothing(hni.name, hni.brand, hni.size),
        listingDetails(hni),
        BuyPrice(1, BigDecimal(hni.currentPrice), hni.discount),
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
        "HARVEY-NICHOLS",
        Map.empty
      )
  }
}
