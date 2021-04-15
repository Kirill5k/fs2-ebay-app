package ebayapp.core.services

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import fs2.Stream
import ebayapp.core.common.Logger

import scala.concurrent.duration.FiniteDuration

abstract class StockComparer[F[_]: Concurrent: Timer: Logger] {

  protected def stockUpdatesStream[D <: ItemDetails](
      config: StockMonitorConfig,
      findItemsEffect: StockMonitorRequest => F[Map[String, ResellableItem[D]]]
  ): Stream[F, ItemStockUpdates[D]] =
    Stream
      .emits(config.monitoringRequests)
      .map(req => getUpdates[D](req, config.monitoringFrequency, findItemsEffect(req)))
      .parJoinUnbounded

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
      .flatMap(r => Stream.emits(r) ++ Stream.sleep_(freq))
      .handleErrorWith { error =>
        Stream.eval_(Logger[F].error(error)(s"error obtaining stock updates")) ++
          getUpdates(req, freq, findItemsEffect)
      }

  private def compareItems[D <: ItemDetails](
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
              req.monitorPriceChange.guard[Option].flatMap(_ => StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice)),
              req.monitorStockChange.guard[Option].flatMap(_ => StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice))
            ).flatten
        }
        ItemStockUpdates(currItem, updates)
      }
      .filter(_.updates.nonEmpty)
      .toList
}
