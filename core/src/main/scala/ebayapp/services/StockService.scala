package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.ItemMapper
import ebayapp.clients.argos.ArgosClient
import ebayapp.clients.argos.mappers.ArgosItemMapper
import ebayapp.clients.argos.responses.ArgosItem
import ebayapp.clients.cex.CexClient
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.clients.cex.responses.CexItem
import ebayapp.clients.jdsports.JdsportsClient
import ebayapp.clients.jdsports.mappers.{JdsportsItem, JdsportsItemMapper}
import ebayapp.clients.selfridges.SelfridgesClient
import ebayapp.clients.selfridges.mappers.{SelfridgesItem, SelfridgesItemMapper}
import ebayapp.common.Logger
import ebayapp.common.config.{SearchQuery, StockMonitorConfig, StockMonitorRequest}
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.stock.ItemStockUpdates
import fs2.Stream

import scala.concurrent.duration._

trait StockService[F[_], I] extends StockComparer[F] {
  def stockUpdates[D <: ItemDetails](
      config: StockMonitorConfig
  )(implicit
      mapper: ItemMapper[I, D]
  ): Stream[F, ItemStockUpdates[D]]
}

final private class ArgosStockService[F[_]: Concurrent: Timer: Logger](
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

final private class CexStockService[F[_]: Concurrent: Timer: Logger](
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

final private class SelfridgesSaleService[F[_]: Concurrent: Timer: Logger](
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

final private class JdsportsSaleService[F[_]: Concurrent: Timer: Logger](
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

object StockService {

  def argos[F[_]: Concurrent: Timer: Logger](client: ArgosClient[F]): F[StockService[F, ArgosItem]] =
    Sync[F].delay(new ArgosStockService[F](client))

  def cex[F[_]: Concurrent: Timer: Logger](client: CexClient[F]): F[StockService[F, CexItem]] =
    Sync[F].delay(new CexStockService[F](client))

  def selfridges[F[_]: Concurrent: Timer: Logger](client: SelfridgesClient[F]): F[StockService[F, SelfridgesItem]] =
    Sync[F].delay(new SelfridgesSaleService[F](client))

  def jdsports[F[_]: Concurrent: Timer: Logger](client: JdsportsClient[F]): F[StockService[F, JdsportsItem]] =
    Sync[F].delay(new JdsportsSaleService[F](client))
}
