package ebayapp.repositories

import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.repositories.entities.ResellableItemEntity


private[repositories] trait ResellableItemEntityMapper[D <: ItemDetails] {
  def toEntity(item: ResellableItem[D]): ResellableItemEntity[D]
  def toDomain(entity: ResellableItemEntity[D]): ResellableItem[D]
}

private[repositories] object ResellableItemEntityMapper {
  val videoGameEntityMapper = new ResellableItemEntityMapper[ItemDetails.Game] {
    override def toEntity(vg: ResellableItem.VideoGame): ResellableItemEntity.VideoGame =
      ResellableItemEntity[ItemDetails.Game](None, vg.itemDetails, vg.listingDetails, vg.price, vg.resellPrice)

    override def toDomain(entity: ResellableItemEntity.VideoGame): ResellableItem.VideoGame =
      ResellableItem[ItemDetails.Game](entity.itemDetails, entity.listingDetails, entity.price, entity.resellPrice)
  }
}
