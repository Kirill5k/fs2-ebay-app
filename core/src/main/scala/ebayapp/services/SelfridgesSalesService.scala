package ebayapp.services

import cats.effect.{Concurrent, Timer}
import ebayapp.clients.selfridges.SelfridgesClient
import ebayapp.common.config.{SearchQuery, StockMonitorConfig}
import ebayapp.domain.ItemDetails.Clothing
import ebayapp.domain.ResellableItem
import ebayapp.domain.stock.ItemStockUpdates
import fs2.Stream
import io.chrisdavenport.log4cats.Logger

trait SelfridgesSalesService[F[_]] {
  def newSaleItems(config: StockMonitorConfig): Stream[F, ItemStockUpdates[Clothing]]
}

final private class LiveSelfridgesSalesService[F[_]: Concurrent: Timer: Logger](
    private val client: SelfridgesClient[F]
) extends StockComparer[F] with SelfridgesSalesService[F] {

  override def newSaleItems(config: StockMonitorConfig): Stream[F, ItemStockUpdates[Clothing]] =
    Stream
      .emits(config.monitoringRequests)
      .map(req => getUpdates[Clothing](req, config.monitoringFrequency, findItems(req.query)))
      .parJoinUnbounded

  private def findItems(query: SearchQuery): F[Map[String, ResellableItem[Clothing]]] =
    client
      .search(query)
      .filter(_.buyPrice.discount.exists(_ > 30))
      .filter(_.buyPrice.quantityAvailable > 0)
      .map(item => (item.itemDetails.fullName, item))
      .collect {
        case (Some(name), item) => (name, item)
      }
      .compile
      .to(Map)
}
