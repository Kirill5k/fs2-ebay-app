package ebayapp.core.repositories

import cats.syntax.apply._
import ebayapp.core.domain.search.{BuyPrice, SellPrice}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.repositories.entities.ResellableItemEntity
import ebayapp.core.repositories.entities.ItemPrice
import mongo4cats.bson.ObjectId

private[repositories] trait ResellableItemEntityMapper {
  def toEntity(item: ResellableItem): ResellableItemEntity
  def toDomain(entity: ResellableItemEntity): ResellableItem

  protected def mapPrice(price: BuyPrice, resellPrice: Option[SellPrice]): ItemPrice =
    ItemPrice(
      price.rrp.toString(),
      price.quantityAvailable,
      resellPrice.map(_.cash.toString()),
      resellPrice.map(_.credit.toString())
    )
}

private[repositories] object ResellableItemEntityMapper {

  implicit val videoGameEntityMapper = new ResellableItemEntityMapper {
    override def toEntity(item: ResellableItem): ResellableItemEntity =
      ResellableItemEntity(ObjectId(), item.kind, item.itemDetails, item.listingDetails, mapPrice(item.buyPrice, item.sellPrice))

    override def toDomain(entity: ResellableItemEntity): ResellableItem =
      ResellableItem(
        entity.kind,
        entity.itemDetails,
        entity.listingDetails,
        BuyPrice(entity.price.quantityAvailable, BigDecimal(entity.price.buy)),
        (entity.price.sell, entity.price.credit).mapN((s, c) => SellPrice(BigDecimal(s), BigDecimal(c)))
      )
  }
}
