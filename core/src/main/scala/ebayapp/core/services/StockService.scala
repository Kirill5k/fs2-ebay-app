package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.effect.syntax.spawn.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.{Retailer, SearchClient, SearchCriteria}
import ebayapp.core.common.{Cache, Logger}
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import fs2.{Pipe, Stream}

import scala.concurrent.duration.*

trait StockService[F[_]]:
  def stockUpdates: Stream[F, ItemStockUpdates]

final private class SimpleStockService[F[_]](
    private val retailer: Retailer,
    private val config: StockMonitorConfig,
    private val client: SearchClient[F],
    private val cache: Cache[F, String, ResellableItem]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends StockService[F] {

  override def stockUpdates: Stream[F, ItemStockUpdates] =
      Stream
        .emits(config.monitoringRequests.zipWithIndex)
        .covary[F]
        .evalTap((req, _) => preloadCache(req))
        .map { (req, index) =>
          Stream
            .awakeDelay(config.monitoringFrequency)
            .flatMap(_ => getUpdates(req))
            .delayBy(config.delayBetweenRequests.getOrElse(Duration.Zero) * index.toLong)
        }
        .parJoinUnbounded
        .concurrently(Stream.eval(logCacheSize))

  private def preloadCache(req: StockMonitorRequest): F[Unit] =
    client
      .search(req.searchCriteria)
      .through(withFiltersApplied(req.searchCriteria))
      .evalMap(item => cache.put(item.key, item))
      .compile
      .drain

  private def logCacheSize: F[Unit] =
    F.sleep(config.monitoringFrequency) >>
      cache.size.flatMap(s => logger.info(s"""${retailer.name}-cache-stock currently contains $s items""")) >>
      logCacheSize

  private def getUpdates(req: StockMonitorRequest): Stream[F, ItemStockUpdates] =
    client
      .search(req.searchCriteria)
      .through(withFiltersApplied(req.searchCriteria))
      .evalMap(item => cache.get(item.key).map(_ -> item))
      .evalMap {
        case (None, currItem) =>
          cache.put(currItem.key, currItem).as(Some(ItemStockUpdates(currItem, List(StockUpdate.New))))
        case (Some(prevItem), currItem) if currItem.isPostedAfter(prevItem) =>
          val upd1    = if req.monitorPriceChange then StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice).toList else Nil
          val upd2    = if req.monitorStockChange then StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice).toList else Nil
          val updates = upd1 ++ upd2
          cache.put(currItem.key, currItem).as(Option.when(updates.nonEmpty)(ItemStockUpdates(currItem, updates)))
        case _ =>
          F.pure(None)
      }
      .unNone
      .handleErrorWith { error =>
        Stream.eval(logger.error(error)(s"${retailer.name}-stock/error - ${error.getMessage}")).drain ++
          getUpdates(req)
      }

  private def withFiltersApplied(sc: SearchCriteria): Pipe[F, ResellableItem, ResellableItem] =
    _.filter { ri =>
      sc.minDiscount.fold(true)(min => ri.buyPrice.discount.exists(_ >= min))
    }
      .filter { ri =>
        ri.itemDetails.fullName match {
          case Some(name) =>
            sc.excludeFilterRegex.fold(true)(filter => !name.matches(filter)) &&
            sc.includeFiltersRegex.fold(true)(filter => name.matches(filter))
          case None =>
            false
        }
      }

  extension (item: ResellableItem)
    def key: String = item.itemDetails.fullName.get
    def isPostedAfter(otherItem: ResellableItem): Boolean =
      item.listingDetails.datePosted.isAfter(otherItem.listingDetails.datePosted)
}

object StockService:
  def make[F[_]: Temporal: Logger](
      retailer: Retailer,
      config: StockMonitorConfig,
      client: SearchClient[F]
  ): F[StockService[F]] =
    Cache
      .make[F, String, ResellableItem](4.hours, 1.minute)
      .map(cache => SimpleStockService[F](retailer, config, client, cache))
