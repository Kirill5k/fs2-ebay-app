package ebayapp.core.clients

import ebayapp.core.domain.{ItemKind, ResellableItem}
import fs2.Stream

final case class SearchCriteria(
    query: String,
    category: Option[String] = None,
    itemKind: Option[ItemKind] = None
)

sealed abstract class Retailer(val name: String)
object Retailer {
  case object Cex        extends Retailer("cex")
  case object Ebay       extends Retailer("ebay")
  case object Selfridges extends Retailer("selfridges")
  case object Argos      extends Retailer("argos")
  case object Scotts     extends Retailer("scotts")
  case object Jdsports   extends Retailer("jdsports")
  case object Tessuti    extends Retailer("tessuti")
  case object Nvidia     extends Retailer("nvidia")
  case object Scan       extends Retailer("scan")
}

trait SearchClient[F[_]] {
  def search(criteria: SearchCriteria): Stream[F, ResellableItem]
}
