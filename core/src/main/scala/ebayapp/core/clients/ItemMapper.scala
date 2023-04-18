package ebayapp.core.clients

import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria

private[clients] trait ItemMapper[I] {

  def formatSize(size: String): String =
    size
      .replaceFirst("(?i)medium", "M")
      .replaceFirst("(?i)small", "S")
      .replaceFirst("(?i)large", "L")
      .replaceFirst("(?i)(?<=^([X]+|\\dX)) ", "")
      .toUpperCase

  extension (s: String)
    def trimmed: String =
      s.replaceAll("^( )?- ", "").replaceAll(" +", " ")

  def toDomain(foundWith: SearchCriteria)(clientItem: I): ResellableItem
}
