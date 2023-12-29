package ebayapp.core.clients

import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria

private[clients] trait ItemMapper[I] {

  def formatSize(size: String): String =
    size
      .replaceFirst("(?i)^(1 )?size$", "ONE SIZE")
      .replaceFirst("( )?\\([.0-9]+\\)", "")
      .replaceFirst("(?i)medium", "M")
      .replaceFirst("(?i)small", "S")
      .replaceFirst("(?i)large", "L")
      .replaceFirst("(?i)(?<=^([X]+|\\dX)) ", "")
      .replaceFirst("(?<=^UK\\d+)( )?\\(.*\\)", "")
      .replaceFirst("(?<=\\d+) UK MEN", "")
      .replaceFirst("(?i)EUR \\d+ / ", "")
      .replaceFirst("\\d+ (?=[()SMLX]+)", "")
      .replaceFirst("(?i)^XX(?=(S|L))", "2X")
      .replaceFirst("(?i)^XXX(?=(S|L))", "3X")
      .replaceFirst("(?i)^XXXX(?=(S|L))", "4X")
      .replaceFirst("(?i)(?<=\\d+)W (?=[a-zA-Z])", "")
      .trimmed
      .toUpperCase

  extension (s: String)
    def capitalizeAll: String =
      s
        .split(" |-")
        .map(i => if (i.length > 3) i.toLowerCase.capitalize else i.toUpperCase)
        .mkString(" ")
        .replaceAll("(?i)\\bAND\\b", "&")

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
