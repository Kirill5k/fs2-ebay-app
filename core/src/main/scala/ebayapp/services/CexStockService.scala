package ebayapp.services

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.common.Cache
import ebayapp.common.config.{CexConfig, CexStockMonitorConfig, SearchQuery, StockMonitorRequest}
import ebayapp.domain.search.BuyPrice
import ebayapp.domain.stock.{ItemStockUpdates, StockUpdate}
import ebayapp.domain.{ItemDetails, ResellableItem}
import io.chrisdavenport.log4cats.Logger
import fs2._

import scala.concurrent.duration.FiniteDuration

trait CexStockService[F[_]] {
  def stockUpdates[D <: ItemDetails](config: CexStockMonitorConfig)(implicit m: CexItemMapper[D]): Stream[F, ItemStockUpdates[D]]
}

final class RefbasedlCexStockService[F[_]: Concurrent: Timer: Logger](
    private val client: CexClient[F],
    private val searchHistory: Cache[F, String, Unit],
    private val itemsCache: Cache[F, String, BuyPrice]
) extends CexStockService[F] {

  override def stockUpdates[D <: ItemDetails](
      config: CexStockMonitorConfig
  )(
      implicit m: CexItemMapper[D]
  ): Stream[F, ItemStockUpdates[D]] =
    Stream
      .emits(config.monitoringRequests)
      .map(req => getUpdates(req, config.monitoringFrequency))
      .parJoinUnbounded

  private def findItems[D <: ItemDetails](query: SearchQuery)(implicit m: CexItemMapper[D]): F[Map[String, ResellableItem[D]]] =
    client.findItem[D](query).map { items =>
      items.filter(_.itemDetails.fullName.isDefined).map(i => (i.itemDetails.fullName.get, i)).toMap
    }

  private def compareItems[D <: ItemDetails](
      prev: Map[String, ResellableItem[D]],
      curr: Map[String, ResellableItem[D]],
      req: StockMonitorRequest
  ): List[ItemStockUpdates[D]] =
    curr.map {
      case (name, currItem) =>
        val updates = prev.get(name) match {
          case None => List(StockUpdate.New)
          case Some(prevItem) =>
            List(
              if (req.monitorPriceChange) StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice) else None,
              if (req.monitorStockChange) StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice) else None
            ).flatten
        }
        ItemStockUpdates(currItem, updates)
    }.toList

  private def getUpdates[D <: ItemDetails](
      req: StockMonitorRequest,
      freq: FiniteDuration
  )(
      implicit m: CexItemMapper[D]
  ): Stream[F, ItemStockUpdates[D]] =
    Stream
      .unfoldLoopEval[F, Option[Map[String, ResellableItem[D]]], List[ItemStockUpdates[D]]](None) { prevOpt =>
        findItems(req.query).map { curr =>
          (prevOpt.fold(List.empty[ItemStockUpdates[D]])(prev => compareItems(prev, curr, req)), Some(curr.some))
        }
      }
      .flatMap(ups => Stream.emits(ups) ++ Stream.sleep_(freq))
      .filter(_.updates.nonEmpty)
      .handleErrorWith { error =>
        Stream.eval_(Logger[F].error(error)(s"error obtaining stock updates from cex")) ++
          getUpdates(req, freq)
      }
}

object CexStockService {

  final case class CexStockSearchResult[D <: ItemDetails](item: ResellableItem[D], isRepeated: Boolean)

  def refbased[F[_]: Concurrent: Timer: Logger](
      config: CexConfig,
      client: CexClient[F]
  ): F[CexStockService[F]] = {
    val searchHistory = Cache.make[F, String, Unit](
      config.stockMonitor.cacheExpiration,
      config.stockMonitor.cacheValidationPeriod
    )
    val itemsCache = Cache.make[F, String, BuyPrice](
      config.stockMonitor.cacheExpiration,
      config.stockMonitor.cacheValidationPeriod
    )

    (searchHistory, itemsCache).mapN((s, i) => new RefbasedlCexStockService[F](client, s, i))
  }
}
