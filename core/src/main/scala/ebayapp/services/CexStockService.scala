package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.common.Cache
import ebayapp.common.config.{CexConfig, CexStockMonitorConfig, StockMonitorRequest}
import ebayapp.domain.stock.{StockUpdate, StockUpdateType}
import ebayapp.domain.{ItemDetails, ResellableItem}

trait CexStockService[F[_], D <: ItemDetails] {
  def stockUpdates(config: CexStockMonitorConfig): fs2.Stream[F, StockUpdate[D]]
}

final class StatefulCexStockService[F[_]: Concurrent: Timer, D <: ItemDetails](
    private val client: CexClient[F],
    private val searchHistory: Cache[F, String, Unit],
    private val itemsCache: Cache[F, String, ResellableItem[D]]
)(
    implicit val mapper: CexItemMapper[D]
) extends CexStockService[F, D] {

  override def stockUpdates(config: CexStockMonitorConfig): fs2.Stream[F, StockUpdate[D]] =
    (
      fs2.Stream
        .emits(config.monitoringRequests)
        .map(req => fs2.Stream.evalSeq(getUpdates(req)))
        .parJoinUnbounded ++
        fs2.Stream.sleep_(config.monitoringFrequency)
    ).repeat

  private def getUpdates(request: StockMonitorRequest): F[List[StockUpdate[D]]] =
    client
      .findItem[D](request.query)
      .map(_.filter(_.itemDetails.fullName.isDefined))
      .flatMap { items =>
        searchHistory.contains(request.query.base64).flatMap {
          case false => Sync[F].pure(List.empty[StockUpdate[D]]) <* updateCache(items)
          case true  => getStockUpdates(items, request.monitorStockChange, request.monitorPriceChange) <* updateCache(items)
        }
      }
      .flatTap(_ => searchHistory.put(request.query.base64, ()))

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
          case Some(prev) if checkPrice && prev.buyPrice.rrp > i.buyPrice.rrp =>
            Some(StockUpdate(StockUpdateType.PriceDrop(prev.buyPrice.rrp, i.buyPrice.rrp), i))
          case Some(prev) if checkPrice && prev.buyPrice.rrp < i.buyPrice.rrp =>
            Some(StockUpdate(StockUpdateType.PriceRaise(prev.buyPrice.rrp, i.buyPrice.rrp), i))
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
      Cache.make[F, String, Unit](config.stockMonitor.cacheExpiration, config.stockMonitor.cacheValidationPeriod)
    val itemsCache =
      Cache.make[F, String, ResellableItem[ItemDetails.Generic]](
        config.stockMonitor.cacheExpiration,
        config.stockMonitor.cacheValidationPeriod
      )

    (searchHistory, itemsCache).mapN((s, i) => new StatefulCexStockService[F, ItemDetails.Generic](client, s, i))
  }
}
