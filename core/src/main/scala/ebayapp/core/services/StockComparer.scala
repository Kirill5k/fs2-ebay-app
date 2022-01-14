package ebayapp.core.services

import ebayapp.core.common.config.StockMonitorRequest
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}

object StockComparer:
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
