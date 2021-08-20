package ebayapp.core.services

import cats.Monad
import cats.effect.{Concurrent, Temporal}
import cats.implicits._
import ebayapp.core.clients.SearchClient
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.stock.ItemStockUpdates
import fs2.Stream

trait StockService[F[_]] extends StockComparer[F] {
  protected def client: SearchClient[F]

  def stockUpdates(config: StockMonitorConfig): Stream[F, ItemStockUpdates.Anything]

  protected def findItems(req: StockMonitorRequest)(implicit
      logger: Logger[F],
      concurrent: Concurrent[F]
  ): F[Map[String, ResellableItem.Anything]] =
    client
      .search(req.searchCriteria)
      .filter(item => req.minDiscount.fold(true)(min => item.buyPrice.discount.exists(_ >= min)))
      .map(item => (item.itemDetails.fullName, item))
      .collect { case (Some(name), item) => (name, item) }
      .compile
      .to(Map)
      .flatTap(i => logger.info(s"""$name-search "${req.searchCriteria.query}" returned ${i.size} results"""))

}

final private class SimpleStockService[F[_]: Temporal: Logger](
    override val client: SearchClient[F],
    override val name: String
) extends StockService[F] {

  override def stockUpdates(config: StockMonitorConfig): Stream[F, ItemStockUpdates.Anything] =
    stockUpdatesStream(config, (req: StockMonitorRequest) => findItems(req))
}

object StockService {

  def cex[F[_]: Temporal: Logger](client: CexClient[F]): F[StockService[F]] =
    Monad[F].pure(new SimpleStockService[F](client, "cex"))

  def argos[F[_]: Temporal: Logger](client: SearchClient[F]): F[StockService[F]] =
    Monad[F].pure(new SimpleStockService[F](client, "argos"))

  def selfridges[F[_]: Temporal: Logger](client: SearchClient[F]): F[StockService[F]] =
    Monad[F].pure(new SimpleStockService[F](client, "selfridges"))

  def jdsports[F[_]: Temporal: Logger](client: SearchClient[F]): F[StockService[F]] =
    Monad[F].pure(new SimpleStockService[F](client, "jdsports"))

  def tessuti[F[_]: Temporal: Logger](client: SearchClient[F]): F[StockService[F]] =
    Monad[F].pure(new SimpleStockService[F](client, "tessuti"))

  def nvidia[F[_]: Temporal: Logger](client: SearchClient[F]): F[StockService[F]] =
    Monad[F].pure(new SimpleStockService[F](client, "nvidia"))

  def scan[F[_]: Temporal: Logger](client: SearchClient[F]): F[StockService[F]] =
    Monad[F].pure(new SimpleStockService[F](client, "scan"))
}
