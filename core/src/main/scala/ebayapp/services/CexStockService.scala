package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.common.config.{CexStockMonitorConfig, SearchQuery, StockMonitorRequest}
import ebayapp.domain.stock.{ItemStockUpdates, StockUpdate}
import ebayapp.domain.{ItemDetails, ResellableItem}
import io.chrisdavenport.log4cats.Logger
import fs2._

import scala.concurrent.duration.FiniteDuration

trait CexStockService[F[_]] {
  def stockUpdates[D <: ItemDetails: CexItemMapper](config: CexStockMonitorConfig): Stream[F, ItemStockUpdates[D]]
}

final class LiveCexStockService[F[_]: Concurrent: Timer: Logger](
    private val client: CexClient[F]
) extends CexStockService[F] {

  override def stockUpdates[D <: ItemDetails: CexItemMapper](
      config: CexStockMonitorConfig
  ): Stream[F, ItemStockUpdates[D]] =
    Stream
      .emits(config.monitoringRequests)
      .map(req => getUpdates(req, config.monitoringFrequency))
      .parJoinUnbounded

  private def findItems[D <: ItemDetails: CexItemMapper](query: SearchQuery): F[Map[String, ResellableItem[D]]] =
    client.findItem[D](query).map { items =>
      items.groupBy(_.itemDetails.fullName).collect {
        case (Some(name), group) => (name, group.head)
      }
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
              if (req.monitorPriceChange) StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice) else None,
              if (req.monitorStockChange) StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice) else None
            ).flatten
        }
        ItemStockUpdates(currItem, updates)
      }
      .filter(_.updates.nonEmpty)
      .toList

  private def getUpdates[D <: ItemDetails: CexItemMapper](
      req: StockMonitorRequest,
      freq: FiniteDuration
  ): Stream[F, ItemStockUpdates[D]] =
    Stream
      .unfoldLoopEval[F, Option[Map[String, ResellableItem[D]]], List[ItemStockUpdates[D]]](None) { prevOpt =>
        findItems(req.query).map { curr =>
          (prevOpt.fold(List.empty[ItemStockUpdates[D]])(prev => compareItems(prev, curr, req)), Some(curr.some))
        }
      }
      .zipLeft(Stream.awakeEvery[F](freq))
      .flatMap(Stream.emits)
      .handleErrorWith { error =>
        Stream.eval_(Logger[F].error(error)(s"error obtaining stock updates from cex")) ++
          getUpdates(req, freq)
      }
}

object CexStockService {

  def make[F[_]: Concurrent: Timer: Logger](client: CexClient[F]): F[CexStockService[F]] =
    Sync[F].delay(new LiveCexStockService[F](client))
}
