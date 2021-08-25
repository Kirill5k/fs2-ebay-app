package ebayapp.core.services

import cats.syntax.alternative._
import cats.syntax.flatMap._
import cats.syntax.option._
import ebayapp.core.common.config.StockMonitorRequest
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}

trait StockComparer[F[_]] {

  protected def compareItems(
      prev: Map[String, ResellableItem],
      curr: Map[String, ResellableItem],
      req: StockMonitorRequest
  ): List[ItemStockUpdates] =
    curr.flatMap { case (name, currItem) =>
      prev
        .get(name)
        .fold[List[StockUpdate]](List(StockUpdate.New)) { prevItem =>
          List(
            req.monitorPriceChange.guard[Option] >> StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice),
            req.monitorStockChange.guard[Option] >> StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice)
          ).flatten
        }
        .some
        .filter(_.nonEmpty)
        .map(ItemStockUpdates(currItem, _))
    }.toList
}
