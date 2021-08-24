package ebayapp.core.services

import cats.syntax.alternative._
import cats.syntax.functor._
import ebayapp.core.common.config.StockMonitorRequest
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}

trait StockComparer[F[_]] {

  protected def compareItems(
      prev: Map[String, ResellableItem],
      curr: Map[String, ResellableItem],
      req: StockMonitorRequest
  ): List[ItemStockUpdates] =
    curr
      .map { case (name, currItem) =>
        val updates = prev.get(name) match {
          case None => List(StockUpdate.New)
          case Some(prevItem) =>
            List(
              req.monitorPriceChange.guard[Option].as(StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice)).flatten,
              req.monitorStockChange.guard[Option].as(StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice)).flatten
            ).flatten
        }
        ItemStockUpdates(currItem, updates)
      }
      .filter(_.updates.nonEmpty)
      .toList
}
