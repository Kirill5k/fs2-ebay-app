package ebayapp.core.repositories

import cats.syntax.apply._
import ebayapp.core.domain.search.{BuyPrice, SellPrice}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.repositories.entities.ResellableItemEntity
import ebayapp.core.repositories.entities.ItemPrice
import mongo4cats.bson.ObjectId

private[repositories] object ResellableItemEntityMapper {

  def toEntity(item: ResellableItem): ResellableItemEntity =
    ResellableItemEntity(
      ObjectId(),
      item.kind,
      item.itemDetails,
      item.listingDetails,
      ItemPrice(
        item.buyPrice.rrp.toString(),
        item.buyPrice.quantityAvailable,
        item.sellPrice.map(_.cash),
        item.sellPrice.map(_.credit)
      )
    )

  def toDomain(entity: ResellableItemEntity): ResellableItem =
    ResellableItem(
      entity.kind,
      entity.itemDetails,
      entity.listingDetails,
      BuyPrice(entity.price.quantityAvailable, BigDecimal(entity.price.buy)),
      (entity.price.sell, entity.price.credit).mapN((s, c) => SellPrice(s, c))
    )
}
