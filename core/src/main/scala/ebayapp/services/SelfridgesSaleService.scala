package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.selfridges.SelfridgesClient
import ebayapp.common.config.{SearchQuery, StockMonitorConfig}
import ebayapp.domain.ItemDetails.Clothing
import ebayapp.domain.ResellableItem
import ebayapp.domain.stock.ItemStockUpdates
import fs2.Stream
import ebayapp.common.Logger

import scala.concurrent.duration._

trait SelfridgesSaleService[F[_]] {
  def stockUpdates(config: StockMonitorConfig): Stream[F, ItemStockUpdates[Clothing]]
}

final private class LiveSelfridgesSaleService[F[_]: Concurrent: Timer: Logger](
    private val client: SelfridgesClient[F]
) extends StockComparer[F] with SelfridgesSaleService[F] {

  private val minDiscount: Int = 30
  private val filters: String = List(
    "\\d+-\\d+ (year|month)", "thong", "\\bBRA\\b", "bikini", "jersey brief", "swimsuit", "jock( )?strap", "bralette"
  ).mkString("(?i).*(", "|", ").*")

  override def stockUpdates(config: StockMonitorConfig): Stream[F, ItemStockUpdates[Clothing]] =
    Stream
      .emits(config.monitoringRequests.zipWithIndex)
      .map { case (req, index) =>
        getUpdates[Clothing](req, config.monitoringFrequency, findItems(req.query)).delayBy((index * 10).seconds)
      }
      .parJoinUnbounded

  private def findItems(query: SearchQuery): F[Map[String, ResellableItem[Clothing]]] =
    client
      .searchSale(query)
      .filter(!_.itemDetails.name.matches(filters))
      .filter(_.buyPrice.discount.exists(_ > minDiscount))
      .filter(_.buyPrice.quantityAvailable > 0)
      .map(item => (item.itemDetails.fullName, item))
      .collect { case (Some(name), item) => (name, item) }
      .compile
      .to(Map)
      .flatTap(i => Logger[F].info(s"""selfridges-search "${query.value}" returned ${i.size} results"""))
}

object SelfridgesSaleService {
  def make[F[_]: Concurrent: Timer: Logger](client: SelfridgesClient[F]): F[SelfridgesSaleService[F]] =
    Sync[F].delay(new LiveSelfridgesSaleService[F](client))
}
