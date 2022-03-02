package ebayapp.core.services

import cats.Monad
import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.option.*
import ebayapp.core.clients.{Retailer, SearchClient, SearchCriteria}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItem
import ebayapp.core.domain.stock.ItemStockUpdates
import fs2.{Pipe, Stream}

import scala.concurrent.duration.*

trait StockService[F[_]]:
  def stockUpdates: Stream[F, ItemStockUpdates]

final private class SimpleStockService[F[_]: Temporal: Logger](
    private val retailer: Retailer,
    private val config: StockMonitorConfig,
    private val client: SearchClient[F]
) extends StockService[F] {

  override def stockUpdates: Stream[F, ItemStockUpdates] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { (req, index) =>
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
        findItems(req.searchCriteria).map { curr =>
          prevOpt match {
            case Some(prev) => (StockComparer.compareItems(prev, curr, req), Some(StockComparer.mergeItems(prev, curr).some))
            case None       => (List.empty[ItemStockUpdates], Some(curr.some))
          }
        }
      }
      .flatMap(r => Stream.emits(r) ++ Stream.sleep_(freq))
      .handleErrorWith { error =>
        Stream.eval(Logger[F].error(error)(s"${retailer.name}-stock/error - ${error.getMessage}")).drain ++
          getUpdates(req, freq)
      }

  private def withFiltersApplied(sc: SearchCriteria): Pipe[F, ResellableItem, ResellableItem] =
    _.filter(item => sc.minDiscount.fold(true)(min => item.buyPrice.discount.exists(_ >= min)))
      .filter { ri =>
        ri.itemDetails.fullName match {
          case Some(name) =>
            sc.excludeFilterRegex.fold(true)(filter => !name.matches(filter)) &&
            sc.includeFiltersRegex.fold(true)(filter => name.matches(filter))
          case None =>
            false
        }
      }

  private def findItems(sc: SearchCriteria): F[Map[String, ResellableItem]] =
    client
      .search(sc)
      .through(withFiltersApplied(sc))
      .map(item => (item.itemDetails.fullName.get, item))
      .compile
      .to(Map)
      .flatTap(i => Logger[F].info(s"""${retailer.name}-search "${sc.query}" returned ${i.size} results"""))
}

object StockService:
  def make[F[_]: Temporal: Logger](
      retailer: Retailer,
      config: StockMonitorConfig,
      client: SearchClient[F]
  ): F[StockService[F]] =
    Monad[F].pure(SimpleStockService[F](retailer, config, client))
