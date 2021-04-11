package ebayapp.clients.jdsports

import ebayapp.clients.ItemMapper
import ebayapp.domain.{ItemDetails, ResellableItem}

object mappers {

  final case class JdsportsItem()

  type JdsportsItemMapper[D <: ItemDetails] = ItemMapper[JdsportsItem, D]

  implicit val clothingMapper: JdsportsItemMapper[ItemDetails.Clothing] = new JdsportsItemMapper[ItemDetails.Clothing] {

    override def toDomain(si: JdsportsItem): ResellableItem[ItemDetails.Clothing] = ???
  }
}
