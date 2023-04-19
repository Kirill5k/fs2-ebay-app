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
      .replaceFirst("(?<=^[0-9.]+)( )?\\([0-9.]+\\)", "")
      .replaceFirst("(?<=^UK\\d+)( )?\\(.*\\)", "")
      .replaceFirst("\\d+ (?=[()SMLX]+)", "")
      .trimmed
      .toUpperCase

  extension (s: String)
    def capitalizeAll: String =
      s.split(" |-").map(i => if (i.length > 3) i.toLowerCase.capitalize else i.toUpperCase).mkString(" ")

    def cut(replace: String) =
      s.replaceAll("(?i)" + replace, "").trimmed

    def trimmed: String =
      s
        .replaceAll("^( )?- ", "")
        .replaceAll(" +", " ")
        .replaceAll("^\\(|\\)$", "")
        .trim

  def toDomain(foundWith: SearchCriteria)(clientItem: I): ResellableItem
}
