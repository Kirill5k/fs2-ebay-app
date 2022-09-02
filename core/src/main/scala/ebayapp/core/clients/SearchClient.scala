package ebayapp.core.clients

import ebayapp.core.domain.search.SearchCriteria
import ebayapp.kernel.errors.AppError
import ebayapp.core.domain.ResellableItem
import fs2.Stream

enum Retailer(val name: String):
  case Cex              extends Retailer("cex")
  case Ebay             extends Retailer("ebay")
  case Selfridges       extends Retailer("selfridges")
  case Argos            extends Retailer("argos")
  case Scotts           extends Retailer("scotts")
  case Jdsports         extends Retailer("jdsports")
  case Tessuti          extends Retailer("tessuti")
  case Nvidia           extends Retailer("nvidia")
  case Scan             extends Retailer("scan")
  case HarveyNichols    extends Retailer("harvey-nichols")
  case MainlineMenswear extends Retailer("mainline-menswear")

object Retailer:
  def fromUnsafe(name: String): Retailer =
    Retailer.values.find(_.name == name).getOrElse(throw AppError.Critical(s"unrecognized retailer $name"))

trait SearchClient[F[_]]:
  def search(criteria: SearchCriteria): Stream[F, ResellableItem]
