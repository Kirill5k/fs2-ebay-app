package ebayapp.repositories

import ebayapp.domain.search.{BuyPrice, SellPrice}
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.repositories.entities.ResellableItemEntity
import ebayapp.repositories.entities.ResellableItemEntity.ItemPrice
import cats.implicits._
import org.mongodb.scala.bson.ObjectId

private[repositories] trait ResellableItemEntityMapper[I <: ResellableItem[_], E <: ResellableItemEntity] {
  def toEntity(item: I): E
  def toDomain(entity: E): I

  protected def mapPrice(price: BuyPrice, resellPrice: Option[SellPrice]): ItemPrice =
    ItemPrice(
      price.value.toString(),
      price.quantityAvailable,
      resellPrice.map(_.cash.toString()),
      resellPrice.map(_.credit.toString())
    )
}

private[repositories] object ResellableItemEntityMapper {
  val videoGameEntityMapper = new ResellableItemEntityMapper[ResellableItem.VideoGame, ResellableItemEntity.VideoGame] {
    override def toEntity(vg: ResellableItem.VideoGame): ResellableItemEntity.VideoGame =
      ResellableItemEntity.VideoGame(new ObjectId(), vg.itemDetails, vg.listingDetails, mapPrice(vg.buyPrice, vg.sellPrice))

    override def toDomain(entity: ResellableItemEntity.VideoGame): ResellableItem.VideoGame =
      ResellableItem[ItemDetails.Game](
        entity.itemDetails,
        entity.listingDetails,
        BuyPrice(entity.price.quantityAvailable, BigDecimal(entity.price.buy)),
        (entity.price.sell, entity.price.credit).mapN((s, c) => SellPrice(BigDecimal(s), BigDecimal(c)))
      )
  }
}
