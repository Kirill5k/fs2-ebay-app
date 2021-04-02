package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.argos.ArgosClient
import ebayapp.clients.argos.mappers.ArgosItemMapper
import ebayapp.common.config.{SearchQuery, StockMonitorConfig, StockMonitorRequest}
import ebayapp.domain.stock.ItemStockUpdates
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.common.Logger
import fs2._

trait ArgosStockService[F[_]] {
  def stockUpdates[D <: ItemDetails: ArgosItemMapper](config: StockMonitorConfig): Stream[F, ItemStockUpdates[D]]
}

final class LiveArgosStockService[F[_]: Concurrent: Timer: Logger](
    private val client: ArgosClient[F]
) extends StockComparer[F] with ArgosStockService[F] {

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

object ArgosStockService {

  def make[F[_]: Concurrent: Timer: Logger](client: ArgosClient[F]): F[ArgosStockService[F]] =
    Sync[F].delay(new LiveArgosStockService[F](client))
}
