package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.option.*
import ebayapp.core.clients.{Retailer, SearchClient}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.stock.ItemStockUpdates
import fs2.Stream

import scala.concurrent.duration.*

trait StockService[F[_]] extends StockComparer[F]:
  def stockUpdates: Stream[F, ItemStockUpdates]

final private class SimpleStockService[F[_]: Temporal: Logger](
    private val retailer: Retailer,
    private val config: StockMonitorConfig,
    private val client: SearchClient[F]
) extends StockService[F] {

  override def stockUpdates: Stream[F, ItemStockUpdates] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { case (req, index) =>
        getUpdates(req, config.monitoringFrequency)
          .delayBy(config.delayBetweenRequests.getOrElse(Duration.Zero) * index.toLong)
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
        Stream.eval(Logger[F].error(error)(s"${retailer.name}-stock/error - ${error.getMessage}")).drain ++
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
      .flatTap(i => Logger[F].info(s"""${retailer.name}-search "${req.searchCriteria.query}" returned ${i.size} results"""))
}

object StockService:

  def make[F[_]: Temporal: Logger](
      retailer: Retailer,
      config: StockMonitorConfig,
      client: SearchClient[F]
  ): F[StockService[F]] =
    Monad[F].pure(new SimpleStockService[F](retailer, config, client))
