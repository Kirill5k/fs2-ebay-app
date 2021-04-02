package ebayapp.clients

import ebayapp.domain.{ItemDetails, ResellableItem}

trait ItemMapper[I, D <: ItemDetails] {
  def toDomain(clientItem: I): ResellableItem[D]
}
