package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.{Retailer, SearchClient}
import ebayapp.core.common.{Cache, Logger}
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import fs2.concurrent.SignallingRef
import fs2.{Pipe, Stream}

import scala.concurrent.duration.*

trait StockService[F[_]]:
  def retailer: Retailer
  def cachedItems: F[List[ResellableItem]]
  def stockUpdates: Stream[F, ItemStockUpdates]
  def pause: F[Unit]
  def resume: F[Unit]

final private class SimpleStockService[F[_]](
    val retailer: Retailer,
    private val config: StockMonitorConfig,
    private val client: SearchClient[F],
    private val cache: Cache[F, String, ResellableItem],
    private val isPaused: SignallingRef[F, Boolean]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends StockService[F] {

  override def cachedItems: F[List[ResellableItem]] = cache.values
  override def pause: F[Unit]                       = isPaused.set(true) >> logger.info(s"""${retailer.name}-stock-monitor-paused""")
  override def resume: F[Unit]                      = isPaused.set(false) >> logger.info(s"""${retailer.name}-stock-monitor-resumed""")

  override def stockUpdates: Stream[F, ItemStockUpdates] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { (req, index) =>
        preloadCache(req).delayBy(config.delayBetweenRequests.getOrElse(Duration.Zero) * index.toLong) ++
          Stream
            .awakeDelay(config.monitoringFrequency)
            .flatMap(_ => getUpdates(req))
            .pauseWhen(isPaused)
      }
      .parJoinUnbounded
      .concurrently(Stream.awakeEvery(config.monitoringFrequency).evalMap(_ => logCacheSize))

  private def preloadCache(req: StockMonitorRequest): Stream[F, Nothing] =
    client
      .search(req.searchCriteria)
      .through(withFiltersApplied(req.searchCriteria))
      .evalMap(item => cache.put(item.key, item))
      .drain

  private def logCacheSize: F[Unit] =
    cachedItems.flatMap { items =>
      val item = if items.size == 1 then "item" else "items"
      val groups =
        if items.isEmpty then ""
        else items.map(_.foundWith.query).groupMapReduce(identity)(_ => 1)(_ + _).mkString("(", ", ", ")")
      logger.info(s"""${retailer.name}-stock-cache: ${items.size} $item $groups""")
    }

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
    (
      Cache.make[F, String, ResellableItem](6.hours, 1.minute),
      SignallingRef.of(false)
    ).mapN((cache, isPaused) => SimpleStockService[F](retailer, config, client, cache, isPaused))
