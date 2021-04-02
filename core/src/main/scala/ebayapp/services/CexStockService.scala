package ebayapp.services

import cats.effect.{Concurrent, Sync, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.common.config.{SearchQuery, StockMonitorConfig, StockMonitorRequest}
import ebayapp.domain.stock.ItemStockUpdates
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.common.Logger
import fs2._

trait CexStockService[F[_]] {
  def stockUpdates[D <: ItemDetails: CexItemMapper](config: StockMonitorConfig): Stream[F, ItemStockUpdates[D]]
}

final class LiveCexStockService[F[_]: Concurrent: Timer: Logger](
    private val client: CexClient[F]
) extends StockComparer[F] with CexStockService[F] {

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

object CexStockService {

  def make[F[_]: Concurrent: Timer: Logger](client: CexClient[F]): F[CexStockService[F]] =
    Sync[F].delay(new LiveCexStockService[F](client))
}
