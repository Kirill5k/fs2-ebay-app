package ebayapp.core.clients

import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria

private[clients] trait ItemMapper[I] {
  extension (s: String)
    def trimmed: String =
      s.replaceAll("^( )?- ", "").replaceAll(" +", " ")

  def toDomain(foundWith: SearchCriteria)(clientItem: I): ResellableItem
}
