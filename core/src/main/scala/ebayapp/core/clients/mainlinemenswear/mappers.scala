package ebayapp.core.clients.mainlinemenswear

import ebayapp.core.clients.ItemMapper
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}

import java.time.Instant

private[mainlinemenswear] object mappers {

  final case class MainlineMenswearItem(
      id: Long,
      name: String,
      brand: String,
      currentPrice: BigDecimal,
      previousPrice: BigDecimal,
      size: String,
      onlineStock: Int,
      image: String,
      url: String,
      category: String
  )

  type MainlineMenswearItemMapper = ItemMapper[MainlineMenswearItem]

  val mainlineMenswearClothingMapper: MainlineMenswearItemMapper = new MainlineMenswearItemMapper {
    override def toDomain(foundWith: SearchCriteria)(mmi: MainlineMenswearItem): ResellableItem =
      ResellableItem.clothing(itemDetails(mmi), listingDetails(mmi), buyPrice(mmi), None, Some(foundWith))

    private def itemDetails(mmi: MainlineMenswearItem): ItemDetails.Clothing =
      Clothing(
        mmi.name,
        mmi.brand,
        mmi.size
      )

    private def buyPrice(mmi: MainlineMenswearItem): BuyPrice = {
      val current  = mmi.currentPrice
      val rrp = mmi.previousPrice
      val discount = 100 - (current * 100 / rrp).toInt
      BuyPrice(mmi.onlineStock, current, Some(discount))
    }

    private def listingDetails(mmi: MainlineMenswearItem): ListingDetails =
      ListingDetails(
        s"https://www.mainlinemenswear.co.uk/${mmi.url}",
        s"${mmi.name} (${mmi.brand} / ${mmi.size})",
        Some(s"Clothing/${mmi.category}"),
        None,
        None,
        Some(s"https://cdn.mainlinemenswear.co.uk/f_auto,q_auto/mainlinemenswear/${mmi.image}"),
        "NEW",
        Instant.now,
        "mainlinemenswear",
        Map.empty
      )
  }
}
