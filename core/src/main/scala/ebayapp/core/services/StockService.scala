package ebayapp.core.services

import cats.effect.Temporal
import cats.effect.std.Queue
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.core.clients.SearchClient
import ebayapp.kernel.syntax.stream.*
import ebayapp.kernel.syntax.option.*
import ebayapp.core.common.{Cache, ConfigProvider, Logger}
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.{ResellableItem, Retailer}
import ebayapp.core.domain.search.{Filters, SearchCriteria}
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import fs2.concurrent.SignallingRef
import fs2.Stream

import scala.concurrent.duration.*

trait StockService[F[_]]:
  def retailer: Retailer
  def cachedItems: F[List[ResellableItem]]
  def stockUpdates: Stream[F, ItemStockUpdates]
  def pause: F[Unit]
  def resume: F[Unit]

final private class SimpleStockService[F[_]](
    val retailer: Retailer,
    private val configProvider: ConfigProvider[F],
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
    for
      reloads <- Stream.eval(Queue.unbounded[F, Long])
      upd <- configProvider
        .stockMonitor(retailer)
        .zipWithIndex
        .evalTap((_, n) => reloads.offer(n))
        .map { (config, n) =>
          itemStockUpdates(config)
            .interruptWhen(Stream.fromQueueUnterminated(reloads).map(_ >= n + 1))
        }
        .parJoinUnbounded
    yield upd

  private def itemStockUpdates(config: StockMonitorConfig): Stream[F, ItemStockUpdates] =
    Stream.logInfo(s"starting ${retailer.name}-stock-monitor stream") ++
      Stream
        .emits(config.monitoringRequests.zipWithIndex)
        .map { (req, index) =>
          preloadCache(config.filtersOrDefault, req).delayBy(config.delayBetweenRequestsOrDefault * index.toLong) ++
            Stream
              .awakeDelay(config.monitoringFrequency)
              .flatMap(_ => getUpdates(config.filtersOrDefault, req))
              .pauseWhen(isPaused)
        }
        .parJoinUnbounded
        .concurrently(Stream.eval(logCacheSize(config.monitoringFrequency)))
        .onFinalize(cache.clear >> logger.info(s"clearing ${retailer.name}-stock-monitor cache"))

  private def preloadCache(confFilters: Filters, req: StockMonitorRequest): Stream[F, Nothing] =
    client
      .search(req.searchCriteria)
      .filter(confFilters.mergeWith(req.searchCriteria.filtersOrDefault)(_))
      .evalMap(item => cache.put(item.key, item))
      .drain

  private def logCacheSize(frequency: FiniteDuration): F[Unit] =
    F.sleep(frequency) >> cachedItems.flatMap { items =>
      val item = if items.size == 1 then "item" else "items"
      val groups =
        if items.isEmpty then ""
        else items.map(_.foundWith.query).groupMapReduce(identity)(_ => 1)(_ + _).mkString("(", ", ", ")")
      logger.info(s"""${retailer.name}-stock-cache: ${items.size} $item $groups""")
    } >> logCacheSize(frequency)

  private def getUpdates(confFilters: Filters, req: StockMonitorRequest): Stream[F, ItemStockUpdates] =
    client
      .search(req.searchCriteria)
      .filter(confFilters.mergeWith(req.searchCriteria.filtersOrDefault)(_))
      .evalMap(item => cache.get(item.key).map(_ -> item))
      .evalMap {
        case (None, currItem) =>
          cache.put(currItem.key, currItem).as(Some(ItemStockUpdates(currItem, List(StockUpdate.New))))
        case (Some(prevItem), currItem) if currItem.isPostedAfter(prevItem) =>
          val upd1    = Option.flatWhen(req.monitorPriceChange)(StockUpdate.priceChanged(prevItem.buyPrice, currItem.buyPrice)).toList
          val upd2    = Option.flatWhen(req.monitorStockChange)(StockUpdate.quantityChanged(prevItem.buyPrice, currItem.buyPrice)).toList
          val updates = upd1 ++ upd2
          cache.put(currItem.key, currItem).as(Option.when(updates.nonEmpty)(ItemStockUpdates(currItem, updates)))
        case _ =>
          F.pure(None)
      }
      .unNone
      .filter(_ => req.notifyOnChange.exists(identity))
      .handleErrorWith { error =>
        Stream.logError(error)(s"${retailer.name}-stock/error - ${error.getMessage}") ++ getUpdates(confFilters, req)
      }

  extension (config: StockMonitorConfig)
    private def filtersOrDefault: Filters                     = config.filters.getOrElse(Filters())
    private def delayBetweenRequestsOrDefault: FiniteDuration = config.delayBetweenRequests.getOrElse(Duration.Zero)

  extension (sc: SearchCriteria) private def filtersOrDefault: Filters = sc.filters.getOrElse(Filters())

  extension (item: ResellableItem)
    private def key: String = s"${item.listingDetails.url}-${item.itemDetails.fullName.getOrElse("unknown")}"
    private def isPostedAfter(otherItem: ResellableItem): Boolean =
      item.listingDetails.datePosted.isAfter(otherItem.listingDetails.datePosted)
}

object StockService:
  def make[F[_]: Temporal: Logger](
      retailer: Retailer,
      configProvider: ConfigProvider[F],
      client: SearchClient[F]
  ): F[StockService[F]] =
    (
      Cache.make[F, String, ResellableItem](6.hours, 1.minute),
      SignallingRef.of(false)
    ).mapN((cache, isPaused) => SimpleStockService[F](retailer, configProvider, client, cache, isPaused))
