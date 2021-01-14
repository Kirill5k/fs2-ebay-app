package ebayapp.clients.selfridges

import ebayapp.clients.selfridges.SelfridgesClient.{CatalogItem, ItemStock}
import ebayapp.domain.ItemDetails.Clothing
import ebayapp.domain.search.{BuyPrice, ListingDetails}
import ebayapp.domain.{ItemDetails, ResellableItem}

import java.time.Instant

object mappers {

  trait SelfridgesItemMapper[D <: ItemDetails] {
    def toDomain(item: CatalogItem, stock: ItemStock): ResellableItem[D]
  }

  implicit val clothingMapper: SelfridgesItemMapper[ItemDetails.Clothing] = new SelfridgesItemMapper[ItemDetails.Clothing] {

    override def toDomain(item: CatalogItem, stock: ItemStock): ResellableItem[ItemDetails.Clothing] =
      ResellableItem[ItemDetails.Clothing](
        itemDetails(item, stock),
        listingDetails(item),
        price(item, stock),
        None
      )

    private def itemDetails(item: CatalogItem, stock: ItemStock): ItemDetails.Clothing =
      Clothing(
        item.name,
        item.brandName,
        stock.value
      )

    private def price(item: CatalogItem, stock: ItemStock): BuyPrice = {
      val current  = item.price.map(_.lowestPrice).min
      val rrp      = item.price.flatMap(p => p.lowestWasWasPrice.orElse(p.lowestWasPrice)).maxOption
      val discount = rrp.map(current * 100 / _).map(100 - _.toInt)

      BuyPrice(
        stock.`Stock Quantity Available to Purchase`,
        current,
        discount
      )
    }

    private def listingDetails(item: CatalogItem): ListingDetails =
      ListingDetails(
        s"https://www.selfridges.com/GB/en/cat/${item.seoKey}",
        item.name,
        None,
        None,
        None,
        Some(s"https://images.selfridges.com/is/image/selfridges/${item.imageName}"),
        s"NEW",
        Instant.now,
        "SELFRIDGES",
        Map()
      )
  }
}
