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
      stock: List[ItemStock],
      price: Option[ItemPrice]
  ) {
    val size: String  = stock.find(_.key.exists(_ == "SizeCode")).flatMap(_.value).getOrElse("ONE SIZE")
    val quantity: Int = stock.map(_.`Stock Quantity Available to Purchase`).maxOption.getOrElse(0)
    val otherDetails: String = {
      val od = stock.filterNot(_.key.exists(_ == "SizeCode")).flatMap(_.value)
      if (od.isEmpty) "" else od.mkString(" (", ",", ")")
    }
  }

  type SelfridgesItemMapper = ItemMapper[SelfridgesItem]
  object SelfridgesItemMapper {
    def clothing: SelfridgesItemMapper = new SelfridgesItemMapper {

      override def toDomain(foundWith: SearchCriteria)(si: SelfridgesItem): ResellableItem =
        ResellableItem.clothing(
          itemDetails(si),
          listingDetails(si),
          buyPrice(si),
          None,
          foundWith
        )

      private def itemDetails(si: SelfridgesItem): ItemDetails.Clothing =
        Clothing(
          s"${si.item.fullName}${si.otherDetails}",
          si.item.brandName.capitalizeAll,
          formatSize(si.size)
        )

      private def buyPrice(si: SelfridgesItem): BuyPrice = {
        val current = si.price.map(_.`Current Retail Price`).getOrElse(si.item.price.map(_.lowestPrice).min)
        val rrp = si.price
          .flatMap(_.`Was Was Retail Price`)
          .orElse(si.price.flatMap(_.`Was Retail Price`))
          .orElse(si.item.price.flatMap(p => p.lowestWasWasPrice.orElse(p.lowestWasPrice)).maxOption)
        val discount = rrp.map(current * 100 / _).map(100 - _.toInt)

        BuyPrice(
          si.quantity,
          current,
          discount
        )
      }

      private def listingDetails(si: SelfridgesItem): ListingDetails =
        ListingDetails(
          s"https://www.selfridges.com/GB/en/cat/${si.item.seoKey}",
          s"${si.item.fullName}${si.otherDetails}",
          None,
          si.item.shortDescription,
          None,
          si.item.imageName.map(in => s"https://images.selfridges.com/is/image/selfridges/$in"),
          "NEW",
          Instant.now,
          "Selfridges",
          List(
            Some("stockKeys" -> si.stock.flatMap(_.key).mkString(", ")),
            si.price.map(_.`Current Retail Price`).map(p => "currentPrice" -> p.toString),
            si.price.flatMap(_.`Was Retail Price`).map(p => "wasPrice" -> p.toString),
            si.price.flatMap(_.`Was Was Retail Price`).map(p => "wasWasPrice" -> p.toString)
          ).flatten.toMap
        )
    }
  }
}
