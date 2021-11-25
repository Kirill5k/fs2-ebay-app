package ebayapp.core.clients

import ebayapp.core.common.errors.AppError
import ebayapp.core.domain.{ItemKind, ResellableItem}
import fs2.Stream
import pureconfig._
import pureconfig.generic.derivation.default._

final case class SearchCriteria(
    query: String,
    category: Option[String] = None,
    itemKind: Option[ItemKind] = None,
    minPrice: Option[BigDecimal] = None,
    maxPrice: Option[BigDecimal] = None
) derives ConfigReader


enum Retailer(val name: String):
  case Cex        extends Retailer("cex")
  case Ebay       extends Retailer("ebay")
  case Selfridges extends Retailer("selfridges")
  case Argos      extends Retailer("argos")
  case Scotts     extends Retailer("scotts")
  case Jdsports   extends Retailer("jdsports")
  case Tessuti    extends Retailer("tessuti")
  case Nvidia     extends Retailer("nvidia")
  case Scan       extends Retailer("scan")

object Retailer:
  def fromUnsafe(name: String): Retailer =
    Retailer.values.find(_.name == name).getOrElse(throw AppError.Critical(s"unrecognized retailer $name"))

trait SearchClient[F[_]]:
  def search(criteria: SearchCriteria): Stream[F, ResellableItem]
