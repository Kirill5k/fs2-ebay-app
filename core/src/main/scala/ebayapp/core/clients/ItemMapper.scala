package ebayapp.core.clients

import ebayapp.core.domain.{ItemDetails, ResellableItem}

trait ItemMapper[I, D <: ItemDetails] {
  def toDomain(clientItem: I): ResellableItem[D]
}
