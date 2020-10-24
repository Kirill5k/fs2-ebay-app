package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.common.Cache
import ebayapp.common.config.{CexConfig, SearchQuery, StockMonitorRequest}
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.stock.{StockUpdate, StockUpdateType}

trait CexStockService[F[_], D <: ItemDetails] {
  def getUpdates(request: StockMonitorRequest): F[List[StockUpdate[D]]]
}

final class StatefulCexStockService[F[_]: Sync, D <: ItemDetails](
    private val client: CexClient[F],
    private val searchHistory: Cache[F, SearchQuery, Unit],
    private val itemsCache: Cache[F, String, ResellableItem[D]]
)(
    implicit val mapper: CexItemMapper[D]
) extends CexStockService[F, D] {

  override def getUpdates(request: StockMonitorRequest): F[List[StockUpdate[D]]] =
    client
      .findItem[D](request.query)
      .map(_.filter(_.itemDetails.fullName.isDefined))
      .flatMap { items =>
        searchHistory.contains(request.query).flatMap {
          case false => Sync[F].pure(List.empty[StockUpdate[D]]) <* updateCache(items)
          case true  => getStockUpdates(items, request.monitorStockChange, request.monitorPriceChange) <* updateCache(items)
        }
      }
      .flatTap(_ => searchHistory.put(request.query, ()))

  private def updateCache(items: List[ResellableItem[D]]): F[Unit] =
    items.traverse(i => itemsCache.put(i.itemDetails.fullName.get, i)).void

  private def getStockUpdates(
      items: List[ResellableItem[D]],
      checkQuantity: Boolean,
      checkPrice: Boolean
  ): F[List[StockUpdate[D]]] =
    items
      .traverse { i =>
        itemsCache.get(i.itemDetails.fullName.get).map {
          case None => Some(StockUpdate(StockUpdateType.New, i))
          case Some(prev) if checkQuantity && prev.buyPrice.quantityAvailable > i.buyPrice.quantityAvailable =>
            Some(StockUpdate(StockUpdateType.StockDecrease(prev.buyPrice.quantityAvailable, i.buyPrice.quantityAvailable), i))
          case Some(prev) if checkQuantity && prev.buyPrice.quantityAvailable < i.buyPrice.quantityAvailable =>
            Some(StockUpdate(StockUpdateType.StockIncrease(prev.buyPrice.quantityAvailable, i.buyPrice.quantityAvailable), i))
          case Some(prev) if checkPrice && prev.buyPrice.value > i.buyPrice.value =>
            Some(StockUpdate(StockUpdateType.PriceDrop(prev.buyPrice.value, i.buyPrice.value), i))
          case Some(prev) if checkPrice && prev.buyPrice.value < i.buyPrice.value =>
            Some(StockUpdate(StockUpdateType.PriceRaise(prev.buyPrice.value, i.buyPrice.value), i))
          case _ => None
        }
      }
      .map(_.flatten)
}

object CexStockService {

  def genericStateful[F[_]: Concurrent: Timer](
      config: CexConfig,
      client: CexClient[F]
  ): F[CexStockService[F, ItemDetails.Generic]] = {
    val searchHistory =
      Cache.make[F, SearchQuery, Unit](config.stockMonitor.cacheExpiration, config.stockMonitor.cacheValidationPeriod)
    val itemsCache =
      Cache.make[F, String, ResellableItem[ItemDetails.Generic]](config.stockMonitor.cacheExpiration, config.stockMonitor.cacheValidationPeriod)

    (searchHistory, itemsCache).mapN((s, i) => new StatefulCexStockService[F, ItemDetails.Generic](client, s, i))
  }
}
