package ebayapp.core.services

import cats.Monad
import cats.effect.{Concurrent, Temporal}
import cats.implicits._
import ebayapp.core.clients.{ItemMapper, SearchClient}
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
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.stock.ItemStockUpdates
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import fs2.Stream

import scala.concurrent.duration._

trait StockService[F[_], I] extends StockComparer[F] {
  protected def client: SearchClient[F, I]

  def stockUpdates[D <: ItemDetails](
      config: StockMonitorConfig
  )(implicit
      mapper: ItemMapper[I, D]
  ): Stream[F, ItemStockUpdates[D]]

  protected def itemFilter[D <: ItemDetails]: (String, ResellableItem[D]) => Boolean = (_, _) => true

  protected def findItems[D <: ItemDetails](
      req: StockMonitorRequest
  )(implicit
      mapper: ItemMapper[I, D],
      logger: Logger[F],
      concurrent: Concurrent[F]
  ): F[Map[String, ResellableItem[D]]] =
    client
      .search[D](req.query)
      .filter(item => req.minDiscount.fold(true)(min => item.buyPrice.discount.exists(_ >= min)))
      .map(item => (item.itemDetails.fullName, item))
      .collect { case (Some(name), item) => (name, item) }
      .filter { case (name, item) => itemFilter[D](name, item) }
      .compile
      .to(Map)
      .flatTap(i => logger.info(s"""$name-search "${req.query.value}" returned ${i.size} results"""))
}

final private class ArgosStockService[F[_]: Temporal: Logger](
    override val client: ArgosClient[F]
) extends StockService[F, ArgosItem] {
  override protected val name: String = "argos"

  override def stockUpdates[D <: ItemDetails: ArgosItemMapper](
      config: StockMonitorConfig
  ): Stream[F, ItemStockUpdates[D]] =
    stockUpdatesStream(config, (req: StockMonitorRequest) => findItems[D](req))
}

final private class CexStockService[F[_]: Temporal: Logger](
    override val client: CexClient[F]
) extends StockService[F, CexItem] {
  override protected val name: String = "cex"

  override def stockUpdates[D <: ItemDetails: CexItemMapper](
      config: StockMonitorConfig
  ): Stream[F, ItemStockUpdates[D]] =
    stockUpdatesStream(config, (req: StockMonitorRequest) => findItems[D](req))
}

final private class SelfridgesSaleService[F[_]: Temporal: Logger](
    override val client: SelfridgesClient[F]
) extends StockService[F, SelfridgesItem] {
  override protected val name: String = "selfridges"

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

  override protected def itemFilter[D <: ItemDetails]: (String, ResellableItem[D]) => Boolean =
    (name, item) => item.buyPrice.quantityAvailable > 0 && !name.matches(filters)

  override def stockUpdates[D <: ItemDetails: SelfridgesItemMapper](config: StockMonitorConfig): Stream[F, ItemStockUpdates[D]] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { case (req, index) =>
        getUpdates[D](req, config.monitoringFrequency, findItems(req)).delayBy((index * 10).seconds)
      }
      .parJoinUnbounded
}

final private class JdsportsSaleService[F[_]: Temporal: Logger](
    override val client: JdsportsClient[F]
) extends StockService[F, JdsportsItem] {
  override protected val name: String = "jdsports"

  override def stockUpdates[D <: ItemDetails: JdsportsItemMapper](config: StockMonitorConfig): Stream[F, ItemStockUpdates[D]] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { case (req, index) =>
        getUpdates[D](req, config.monitoringFrequency, findItems(req)).delayBy((index * 10).seconds)
      }
      .parJoinUnbounded
}

final private class NvidiaStockService[F[_]: Temporal: Logger](
    override val client: NvidiaClient[F]
) extends StockService[F, NvidiaItem] {
  override protected val name: String = "nvidia"

  override def stockUpdates[D <: ItemDetails: NvidiaItemMapper](
      config: StockMonitorConfig
  ): Stream[F, ItemStockUpdates[D]] =
    stockUpdatesStream(config, (req: StockMonitorRequest) => findItems[D](req))
}

final private class ScanStockService[F[_]: Temporal: Logger](
    override val client: ScanClient[F]
) extends StockService[F, ScanItem] {
  override protected val name: String = "scan"

  override def stockUpdates[D <: ItemDetails: ScanItemMapper](
      config: StockMonitorConfig
  ): Stream[F, ItemStockUpdates[D]] =
    stockUpdatesStream(config, (req: StockMonitorRequest) => findItems[D](req))
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
