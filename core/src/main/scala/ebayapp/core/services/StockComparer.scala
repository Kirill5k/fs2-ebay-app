package ebayapp.core.services

import ebayapp.core.common.config.StockMonitorRequest
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import java.time.Instant

import scala.concurrent.duration._

object StockComparer:
  def mergeItems(
      prev: Map[String, ResellableItem],
      curr: Map[String, ResellableItem]
  ): Map[String, ResellableItem] =
    val allKeys = prev.keySet.union(curr.keySet)
    val ts   = Instant.now.minusSeconds(6.hours.toSeconds)
    allKeys.flatMap { key =>
      (prev.get(key), curr.get(key)) match {
        case (Some(p), Some(c))                                         => Some((key, c))
        case (None, Some(c))                                            => Some((key, c))
        case (Some(p), None) if p.listingDetails.datePosted.isAfter(ts) => Some((key, p))
        case _                                                          => None
      }
    }.toMap

  def compareItems(
      prev: Map[String, ResellableItem],
      curr: Map[String, ResellableItem],
      req: StockMonitorRequest
  ): List[ItemStockUpdates] =
    curr
      .map((name, currItem) => (prev.get(name), currItem))
      .flatMap {
        case (None, currItem) =>
          Some(ItemStockUpdates(currItem, List(StockUpdate.New)))
        case (Some(prevItem), currItem) =>
          val upd1    = if req.monitorPriceChange then StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice).toList else Nil
          val upd2    = if req.monitorStockChange then StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice).toList else Nil
          val updates = upd1 ++ upd2
          Option.when(updates.nonEmpty)(ItemStockUpdates(currItem, updates))
      }
      .toList
