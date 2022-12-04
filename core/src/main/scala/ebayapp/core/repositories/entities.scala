package ebayapp.core.repositories

import cats.syntax.apply.*
import ebayapp.core.domain.{ItemDetails, ItemKind, ResellableItem}
import ebayapp.core.domain.search.{BuyPrice, ListingDetails, SearchCriteria, SellPrice}
import org.bson.types.ObjectId
import io.circe.Codec
import mongo4cats.circe.given

private[repositories] object entities {

  final case class ItemPrice(
      buy: BigDecimal,
      quantityAvailable: Int,
      sell: Option[BigDecimal],
      credit: Option[BigDecimal]
  ) derives Codec.AsObject

  final case class ResellableItemEntity(
      _id: ObjectId,
      itemDetails: ItemDetails,
      listingDetails: ListingDetails,
      price: ItemPrice,
      foundWith: Option[SearchCriteria]
  ) derives Codec.AsObject:
    def toDomain: ResellableItem =
      ResellableItem(
        itemDetails,
        listingDetails,
        BuyPrice(price.quantityAvailable, price.buy),
        (price.sell, price.credit).mapN((s, c) => SellPrice(s, c)),
        foundWith.getOrElse(SearchCriteria("n/a"))
      )

  object ResellableItemEntity:
    def from(item: ResellableItem): ResellableItemEntity =
      ResellableItemEntity(
        ObjectId(),
        item.itemDetails,
        item.listingDetails,
        ItemPrice(
          item.buyPrice.rrp,
          item.buyPrice.quantityAvailable,
          item.sellPrice.map(_.cash),
          item.sellPrice.map(_.credit)
        ),
        Some(item.foundWith)
      )
}
