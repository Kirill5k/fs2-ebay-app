package ebayapp.core.clients

import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria

private[clients] trait ItemMapper[I] {
  def toDomain(foundWith: SearchCriteria)(clientItem: I): ResellableItem
}
