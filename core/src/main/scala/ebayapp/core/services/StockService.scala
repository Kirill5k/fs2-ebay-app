package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.argos.ArgosClient
import ebayapp.core.clients.argos.mappers.ArgosItemMapper
import ebayapp.core.clients.argos.responses.ArgosItem
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.cex.mappers.CexItemMapper
import ebayapp.core.clients.cex.responses.CexItem
import ebayapp.core.clients.jdsports.JdsportsClient
import ebayapp.core.clients.jdsports.mappers.{JdsportsItem, JdsportsItemMapper}
import ebayapp.core.clients.nvidia.NvidiaClient
import ebayapp.core.clients.nvidia.mappers.NvidiaItemMapper
import ebayapp.core.clients.nvidia.responses.NvidiaItem
import ebayapp.core.clients.scan.ScanClient
import ebayapp.core.clients.scan.mappers.ScanItemMapper
import ebayapp.core.clients.scan.parsers.ScanItem
import ebayapp.core.clients.selfridges.SelfridgesClient
import ebayapp.core.clients.selfridges.mappers.{SelfridgesItem, SelfridgesItemMapper}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{SearchCategory, SearchQuery, StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.stock.ItemStockUpdates
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2.Stream

import scala.concurrent.duration._

trait StockService[F[_], I] extends StockComparer[F] {
  def stockUpdates[D <: ItemDetails](
      config: StockMonitorConfig
  )(implicit
      mapper: ItemMapper[I, D]
  ): Stream[F, ItemStockUpdates[D]]
}

final private class ArgosStockService[F[_]: Temporal: Logger](
    private val client: ArgosClient[F]
) extends StockService[F, ArgosItem] {

  override def stockUpdates[D <: ItemDetails: ArgosItemMapper](
      config: StockMonitorConfig
  ): Stream[F, ItemStockUpdates[D]] =
    stockUpdatesStream(config, (req: StockMonitorRequest) => findItems[D](req.query))

  private def findItems[D <: ItemDetails: ArgosItemMapper](query: SearchQuery): F[Map[String, ResellableItem[D]]] =
    client
      .findItem[D](query)
      .map(item => (item.itemDetails.fullName, item))
      .collect { case (Some(name), item) => (name, item) }
      .compile
      .to(Map)
      .flatTap(i => Logger[F].info(s"""argos-search "${query.value}" returned ${i.size} results"""))
}

final private class CexStockService[F[_]: Temporal: Logger](
    private val client: CexClient[F]
) extends StockService[F, CexItem] {

  override def stockUpdates[D <: ItemDetails: CexItemMapper](
      config: StockMonitorConfig
  ): Stream[F, ItemStockUpdates[D]] =
    stockUpdatesStream(config, (req: StockMonitorRequest) => findItems[D](req.query))

  private def findItems[D <: ItemDetails: CexItemMapper](query: SearchQuery): F[Map[String, ResellableItem[D]]] =
    client.findItem[D](query).map { items =>
      items.groupBy(_.itemDetails.fullName).collect { case (Some(name), group) =>
        (name, group.head)
      }
    }
}

final private class SelfridgesSaleService[F[_]: Temporal: Logger](
    private val client: SelfridgesClient[F]
) extends StockService[F, SelfridgesItem] {

  private val minDiscount: Int = 30
  private val filters: String = List(
    "\\d+-\\d+ (year|month)",
    "thong",
    "\\bBRA\\b",
    "bikini",
    "jersey brief",
    "swimsuit",
    "jock( )?strap",
    "bralette"
  ).mkString("(?i).*(", "|", ").*")

  override def stockUpdates[D <: ItemDetails: SelfridgesItemMapper](config: StockMonitorConfig): Stream[F, ItemStockUpdates[D]] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { case (req, index) =>
        getUpdates[D](req, config.monitoringFrequency, findItems(req.query)).delayBy((index * 10).seconds)
      }
      .parJoinUnbounded

  private def findItems[D <: ItemDetails: SelfridgesItemMapper](query: SearchQuery): F[Map[String, ResellableItem[D]]] =
    client
      .searchSale[D](query)
      .map(item => (item.itemDetails.fullName, item))
      .collect { case (Some(name), item) => (name, item) }
      .filter { case (name, item) =>
        item.buyPrice.discount.exists(_ > minDiscount) &&
          item.buyPrice.quantityAvailable > 0 &&
          !name.matches(filters)
      }
      .compile
      .to(Map)
      .flatTap(i => Logger[F].info(s"""selfridges-search "${query.value}" returned ${i.size} results"""))
}

final private class JdsportsSaleService[F[_]: Temporal: Logger](
    private val client: JdsportsClient[F]
) extends StockService[F, JdsportsItem] {

  private val minDiscount: Int = 49

  override def stockUpdates[D <: ItemDetails: JdsportsItemMapper](config: StockMonitorConfig): Stream[F, ItemStockUpdates[D]] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { case (req, index) =>
        getUpdates[D](req, config.monitoringFrequency, findItems(req.query)).delayBy((index * 10).seconds)
      }
      .parJoinUnbounded

  private def findItems[D <: ItemDetails: JdsportsItemMapper](query: SearchQuery): F[Map[String, ResellableItem[D]]] =
    client
      .searchSale[D](query)
      .map(item => (item.itemDetails.fullName, item))
      .collect { case (Some(name), item) => (name, item) }
      .filter { case (_, item) =>
        item.buyPrice.discount.exists(_ > minDiscount)
      }
      .compile
      .to(Map)
      .flatTap(i => Logger[F].info(s"""jdsports-search "${query.value}" returned ${i.size} results"""))
}

final private class NvidiaStockService[F[_]: Temporal: Logger](
    private val client: NvidiaClient[F]
) extends StockService[F, NvidiaItem] {

  override def stockUpdates[D <: ItemDetails: NvidiaItemMapper](
      config: StockMonitorConfig
  ): Stream[F, ItemStockUpdates[D]] =
    stockUpdatesStream(config, (req: StockMonitorRequest) => findItems[D](req.query, req.category))

  private def findItems[D <: ItemDetails: NvidiaItemMapper](
      query: SearchQuery,
      category: Option[SearchCategory]
  ): F[Map[String, ResellableItem[D]]] =
    client
      .search[D](query, category)
      .map(item => (item.itemDetails.fullName, item))
      .collect { case (Some(name), item) => (name, item) }
      .compile
      .to(Map)
      .flatTap(i => Logger[F].info(s"""nvidia-search "${query.value}" returned ${i.size} results"""))
}

final private class ScanStockService[F[_]: Temporal: Logger](
    private val client: ScanClient[F]
) extends StockService[F, ScanItem] {

  override def stockUpdates[D <: ItemDetails: ScanItemMapper](
      config: StockMonitorConfig
  ): Stream[F, ItemStockUpdates[D]] =
    stockUpdatesStream(config, (req: StockMonitorRequest) => findItems[D](req.query, req.category))

  private def findItems[D <: ItemDetails: ScanItemMapper](
      query: SearchQuery,
      category: Option[SearchCategory]
  ): F[Map[String, ResellableItem[D]]] =
    client
      .search[D](query, category)
      .map(item => (item.itemDetails.fullName, item))
      .collect { case (Some(name), item) => (name, item) }
      .compile
      .to(Map)
      .flatTap(i => Logger[F].info(s"""scan-search "${query.value}" returned ${i.size} results"""))
}

object StockService {

  def argos[F[_]: Temporal: Logger](client: ArgosClient[F]): F[StockService[F, ArgosItem]] =
    Monad[F].pure(new ArgosStockService[F](client))

  def cex[F[_]: Temporal: Logger](client: CexClient[F]): F[StockService[F, CexItem]] =
    Monad[F].pure(new CexStockService[F](client))

  def selfridges[F[_]: Temporal: Logger](client: SelfridgesClient[F]): F[StockService[F, SelfridgesItem]] =
    Monad[F].pure(new SelfridgesSaleService[F](client))

  def jdsports[F[_]: Temporal: Logger](client: JdsportsClient[F]): F[StockService[F, JdsportsItem]] =
    Monad[F].pure(new JdsportsSaleService[F](client))

  def nvidia[F[_]: Temporal: Logger](client: NvidiaClient[F]): F[StockService[F, NvidiaItem]] =
    Monad[F].pure(new NvidiaStockService[F](client))

  def scan[F[_]: Temporal: Logger](client: ScanClient[F]): F[StockService[F, ScanItem]] =
    Monad[F].pure(new ScanStockService[F](client))
}
