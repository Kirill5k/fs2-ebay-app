package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.SearchClient
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.stock.ItemStockUpdates
import fs2.Stream

import scala.concurrent.duration._

trait StockService[F[_]] extends StockComparer[F] {
  def stockUpdates(config: StockMonitorConfig): Stream[F, ItemStockUpdates]
}

final private class SimpleStockService[F[_]: Temporal: Logger](
    private val client: SearchClient[F],
    private val name: String
) extends StockService[F] {

  override def stockUpdates(config: StockMonitorConfig): Stream[F, ItemStockUpdates] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { case (req, index) =>
        getUpdates(req, config.monitoringFrequency).delayBy((index * 10).seconds)
      }
      .parJoinUnbounded

  private def getUpdates(
      req: StockMonitorRequest,
      freq: FiniteDuration
  ): Stream[F, ItemStockUpdates] =
    Stream
      .unfoldLoopEval[F, Option[Map[String, ResellableItem]], List[ItemStockUpdates]](None) { prevOpt =>
        findItems(req).map { curr =>
          (prevOpt.fold(List.empty[ItemStockUpdates])(prev => compareItems(prev, curr, req)), Some(curr.some))
        }
      }
      .flatMap(r => Stream.emits(r) ++ Stream.sleep_(freq))
      .handleErrorWith { error =>
        Stream.eval(Logger[F].error(error)(s"$name-stock/error - ${error.getMessage}")).drain ++
          getUpdates(req, freq)
      }

  private def findItems(req: StockMonitorRequest): F[Map[String, ResellableItem]] =
    client
      .search(req.searchCriteria)
      .filter(item => req.minDiscount.fold(true)(min => item.buyPrice.discount.exists(_ >= min)))
      .map(item => (item.itemDetails.fullName, item))
      .collect { case (Some(name), item) => (name, item) }
      .compile
      .to(Map)
      .flatTap(i => Logger[F].info(s"""$name-search "${req.searchCriteria.query}" returned ${i.size} results"""))
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
