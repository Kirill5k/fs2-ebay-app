package ebayapp.core.clients

import ebayapp.core.domain.{ResellableItem}

private[clients] trait ItemMapper[I] {
  def toDomain(clientItem: I): ResellableItem
}
