package ebayapp.services

import ebayapp.clients.ItemMapper
import ebayapp.common.config.StockMonitorConfig
import ebayapp.domain.ItemDetails
import ebayapp.domain.stock.ItemStockUpdates
import fs2.Stream

trait StockService[F[_], I] {
  def stockUpdates[D <: ItemDetails](
      config: StockMonitorConfig
  )(implicit
      mapper: ItemMapper[I, D]
  ): Stream[F, ItemStockUpdates[D]]
}
