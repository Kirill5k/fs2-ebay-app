package ebayapp.core.domain

import ebayapp.kernel.types.EnumType

enum Retailer:
  case Cex
  case Ebay
  case Selfridges
  case Argos
  case Scotts
  case Jdsports
  case Tessuti
  case Nvidia
  case Scan
  case HarveyNichols
  case MainlineMenswear
  case Flannels

object Retailer extends EnumType[Retailer](() => Retailer.values):
  extension (r: Retailer) def name: String = r.print
