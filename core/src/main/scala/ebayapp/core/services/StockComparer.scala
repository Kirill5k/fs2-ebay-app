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
    curr.flatMap { case (name, currItem) =>
      val updates = prev
        .get(name)
        .fold(List[StockUpdate](StockUpdate.New)) { prevItem =>
          val upd1 = req.monitorPriceChange.guard[Option] >> StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice)
          val upd2 = req.monitorStockChange.guard[Option] >> StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice)
          upd1.toList ++ upd2.toList
        }
      updates.nonEmpty.guard[Option].as(ItemStockUpdates(currItem, updates))
    }.toList
