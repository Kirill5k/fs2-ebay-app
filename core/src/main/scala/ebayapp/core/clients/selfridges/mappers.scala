package ebayapp.core.clients.selfridges

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.selfridges.SelfridgesClient.{CatalogItem, ItemPrice, ItemStock}
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, ListingDetails}
import ebayapp.core.domain.{ItemDetails, ResellableItem}

import java.time.Instant

object mappers {

  final case class SelfridgesItem(
      item: CatalogItem,
      stock: ItemStock,
      price: Option[ItemPrice]
  )

  type SelfridgesItemMapper[D <: ItemDetails] = ItemMapper[SelfridgesItem, D]

  implicit val clothingMapper: SelfridgesItemMapper[ItemDetails.Clothing] = new SelfridgesItemMapper[ItemDetails.Clothing] {

    override def toDomain(si: SelfridgesItem): ResellableItem[ItemDetails.Clothing] =
      ResellableItem[ItemDetails.Clothing](
        itemDetails(si.item, si.stock),
        listingDetails(si.item),
        buyPrice(si.item, si.stock, si.price),
        None
      )

    private def itemDetails(item: CatalogItem, stock: ItemStock): ItemDetails.Clothing =
      Clothing(
        item.name,
        item.brandName,
        stock.value.getOrElse("ONE SIZE")
      )

    private def buyPrice(item: CatalogItem, stock: ItemStock, price: Option[ItemPrice]): BuyPrice = {
      val current = price.map(_.`Current Retail Price`).getOrElse(item.price.map(_.lowestPrice).min)
      val rrp = price
        .flatMap(_.`Was Was Retail Price`)
        .orElse(price.flatMap(_.`Was Retail Price`))
        .orElse(item.price.flatMap(p => p.lowestWasWasPrice.orElse(p.lowestWasPrice)).maxOption)
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
