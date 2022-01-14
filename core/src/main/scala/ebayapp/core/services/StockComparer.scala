package ebayapp.core.services

import cats.syntax.alternative.*
import cats.syntax.functor.*
import cats.syntax.flatMap.*
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
          val upd1    = req.monitorPriceChange.guard[Option] >> StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice)
          val upd2    = req.monitorStockChange.guard[Option] >> StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice)
          val updates = upd1.toList ++ upd2.toList
          updates.nonEmpty.guard[Option].as(ItemStockUpdates(currItem, updates))
      }
      .toList
