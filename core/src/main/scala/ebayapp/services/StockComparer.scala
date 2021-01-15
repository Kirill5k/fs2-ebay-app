package ebayapp.services

import cats.Monad
import cats.effect.Timer
import cats.implicits._
import ebayapp.common.config.StockMonitorRequest
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.stock.{ItemStockUpdates, StockUpdate}
import fs2.Stream
import io.chrisdavenport.log4cats.Logger

import scala.concurrent.duration.FiniteDuration

abstract class StockComparer[F[_]: Monad: Timer: Logger] {

  protected def getUpdates[D <: ItemDetails](
      req: StockMonitorRequest,
      freq: FiniteDuration,
      findItemsEffect: => F[Map[String, ResellableItem[D]]]
  ): Stream[F, ItemStockUpdates[D]] =
    Stream
      .unfoldLoopEval[F, Option[Map[String, ResellableItem[D]]], List[ItemStockUpdates[D]]](None) { prevOpt =>
        findItemsEffect.map { curr =>
          (prevOpt.fold(List.empty[ItemStockUpdates[D]])(prev => compareItems(prev, curr, req)), Some(curr.some))
        }
      }
      .zipLeft(Stream.awakeEvery[F](freq))
      .flatMap(Stream.emits)
      .handleErrorWith { error =>
        Stream.eval_(Logger[F].error(error)(s"error obtaining stock updates")) ++
          getUpdates(req, freq, findItemsEffect)
      }

  protected def compareItems[D <: ItemDetails](
      prev: Map[String, ResellableItem[D]],
      curr: Map[String, ResellableItem[D]],
      req: StockMonitorRequest
  ): List[ItemStockUpdates[D]] =
    curr
      .map { case (name, currItem) =>
        val updates = prev.get(name) match {
          case None => List(StockUpdate.New)
          case Some(prevItem) =>
            List(
              if (req.monitorPriceChange) StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice) else None,
              if (req.monitorStockChange) StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice) else None
            ).flatten
        }
        ItemStockUpdates(currItem, updates)
      }
      .filter(_.updates.nonEmpty)
      .toList
}
