package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.common.Cache
import ebayapp.common.config.{CexConfig, CexStockMonitorConfig, StockMonitorRequest}
import ebayapp.domain.search.BuyPrice
import ebayapp.domain.stock.{ItemStockUpdates, StockUpdate}
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.services.CexStockService.CexStockSearchResult
import io.chrisdavenport.log4cats.Logger

trait CexStockService[F[_]] {
  def stockUpdates[D <: ItemDetails](config: CexStockMonitorConfig)(implicit m: CexItemMapper[D]): fs2.Stream[F, ItemStockUpdates[D]]
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
  ): fs2.Stream[F, ItemStockUpdates[D]] =
    (
      fs2.Stream
        .emits(config.monitoringRequests)
        .map(req => getUpdates(req))
        .parJoinUnbounded ++
        fs2.Stream.sleep_(config.monitoringFrequency)
    ).repeat

  private def getUpdates[D <: ItemDetails](req: StockMonitorRequest)(implicit m: CexItemMapper[D]): fs2.Stream[F, ItemStockUpdates[D]] =
    fs2.Stream
      .eval(searchHistory.contains(req.query.base64))
      .flatMap { isRepeated =>
        fs2.Stream.evalSeq(client.findItem[D](req.query)).map(item => CexStockSearchResult(item, isRepeated)) ++
          fs2.Stream.eval_(searchHistory.put(req.query.base64, ()))
      }
      .filter(_.item.itemDetails.fullName.isDefined)
      .evalMap {
        case CexStockSearchResult(item, false) =>
          Sync[F].pure(ItemStockUpdates(item, Nil))
        case CexStockSearchResult(item, true) =>
          getStockUpdates(item, req.monitorStockChange, req.monitorPriceChange).map(upd => ItemStockUpdates(item, upd))
      }
      .evalTap(upd => itemsCache.put(upd.item.itemDetails.fullName.get, upd.item.buyPrice))
      .filter(_.updates.nonEmpty)
      .handleErrorWith { error =>
        fs2.Stream.eval_(Logger[F].error(error)(s"error obtaining stock updates from cex"))
      }

  private def getStockUpdates[D <: ItemDetails](
      i: ResellableItem[D],
      checkQuantity: Boolean,
      checkPrice: Boolean
  ): F[List[StockUpdate]] =
    itemsCache.get(i.itemDetails.fullName.get).map {
      case None => List(StockUpdate.New)
      case Some(prevPrice) =>
        List(
          if (checkPrice) StockUpdate.priceChanged(prevPrice, i.buyPrice) else None,
          if (checkQuantity) StockUpdate.quantityChanged(prevPrice, i.buyPrice) else None
        ).flatten
    }
}

object CexStockService {

  final case class CexStockSearchResult[D <: ItemDetails](item: ResellableItem[D], isRepeated: Boolean)

  def refbased[F[_]: Concurrent: Timer: Logger](
      config: CexConfig,
      client: CexClient[F]
  ): F[CexStockService[F]] = {
    val searchHistory =
      Cache.make[F, String, Unit](config.stockMonitor.cacheExpiration, config.stockMonitor.cacheValidationPeriod)
    val itemsCache =
      Cache.make[F, String, BuyPrice](
        config.stockMonitor.cacheExpiration,
        config.stockMonitor.cacheValidationPeriod
      )

    (searchHistory, itemsCache).mapN((s, i) => new RefbasedlCexStockService[F](client, s, i))
  }
}
