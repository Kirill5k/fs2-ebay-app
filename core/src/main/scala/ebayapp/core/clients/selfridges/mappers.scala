package ebayapp.core.clients.selfridges

import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.selfridges.responses.{CatalogItem, ItemPrice, ItemStock}
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria}
import ebayapp.core.domain.{ItemDetails, ResellableItem}

import java.time.Instant

private[selfridges] object mappers {

  final case class SelfridgesItem(
      item: CatalogItem,
      stock: ItemStock,
      price: Option[ItemPrice]
  )

  type SelfridgesItemMapper = ItemMapper[SelfridgesItem]

  inline def selfridgesClothingMapper: SelfridgesItemMapper = new SelfridgesItemMapper {

    override def toDomain(foundWith: SearchCriteria)(si: SelfridgesItem): ResellableItem =
      ResellableItem.clothing(
        itemDetails(si.item, si.stock),
        listingDetails(si.item, si.stock, si.price),
        buyPrice(si.item, si.stock, si.price),
        None,
        foundWith
      )

    private def itemDetails(item: CatalogItem, stock: ItemStock): ItemDetails.Clothing =
      Clothing(
        item.fullName,
        item.brandName.capitalizeAll,
        formatSize(stock.value.getOrElse("ONE SIZE"))
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

    private def listingDetails(item: CatalogItem, stock: ItemStock, price: Option[ItemPrice]): ListingDetails =
      ListingDetails(
        s"https://www.selfridges.com/GB/en/cat/${item.seoKey}",
        item.fullName,
        None,
        item.shortDescription,
        None,
        item.imageName.map(in => s"https://images.selfridges.com/is/image/selfridges/$in"),
        "NEW",
        Instant.now,
        "Selfridges",
        List(
          Some("stockKeys" -> stock.key.getOrElse("undefined")),
          price.map(_.`Current Retail Price`).map(p => "currentPrice" -> p.toString),
          price.flatMap(_.`Was Retail Price`).map(p => "wasPrice" -> p.toString),
          price.flatMap(_.`Was Was Retail Price`).map(p => "wasWasPrice" -> p.toString)
        ).flatten.toMap
      )
  }
}
