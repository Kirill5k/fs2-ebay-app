package ebayapp.core.services

import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2.Stream

import scala.concurrent.duration._

abstract class StockComparer[F[_]: Temporal: Logger] {
  protected def name: String

  protected def stockUpdatesStream(
      config: StockMonitorConfig,
      findItemsEffect: StockMonitorRequest => F[Map[String, ResellableItem.Anything]]
  ): Stream[F, ItemStockUpdates.Anything] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { case (req, index) =>
        getUpdates(req, config.monitoringFrequency, findItemsEffect(req)).delayBy((index * 10).seconds)
      }
      .parJoinUnbounded

  protected def getUpdates(
      req: StockMonitorRequest,
      freq: FiniteDuration,
      findItemsEffect: => F[Map[String, ResellableItem.Anything]]
  ): Stream[F, ItemStockUpdates.Anything] =
    Stream
      .unfoldLoopEval[F, Option[Map[String, ResellableItem.Anything]], List[ItemStockUpdates.Anything]](None) { prevOpt =>
        findItemsEffect.map { curr =>
          (prevOpt.fold(List.empty[ItemStockUpdates.Anything])(prev => compareItems(prev, curr, req)), Some(curr.some))
        }
      }
      .flatMap(r => Stream.emits(r) ++ Stream.sleep_(freq))
      .handleErrorWith { error =>
        Stream.eval(Logger[F].error(error)(s"$name-stock/error - ${error.getMessage}")).drain ++
          getUpdates(req, freq, findItemsEffect)
      }

  private def compareItems[D <: ItemDetails](
      prev: Map[String, ResellableItem.Anything],
      curr: Map[String, ResellableItem.Anything],
      req: StockMonitorRequest
  ): List[ItemStockUpdates.Anything] =
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
