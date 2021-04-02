package ebayapp.services

import ebayapp.clients.ItemMapper
import ebayapp.clients.argos.mappers.ArgosItemMapper
import ebayapp.clients.argos.responses.ArgosItem
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.clients.cex.responses.CexItem
import ebayapp.clients.selfridges.mappers.{SelfridgesItem, SelfridgesItemMapper}
import ebayapp.common.config.StockMonitorConfig
import ebayapp.domain.ItemDetails
import ebayapp.domain.stock.ItemStockUpdates
import fs2.Stream

trait StockService[F[_], I] extends StockComparer[F] {
  def stockUpdates[D <: ItemDetails](
      config: StockMonitorConfig
  )(implicit
      mapper: ItemMapper[I, D]
  ): Stream[F, ItemStockUpdates[D]]
}

//trait ArgosStockService[F[_]] extends StockService[F, ArgosItem] {
//  def stockUpdates[D <: ItemDetails](
//      config: StockMonitorConfig
//  )(implicit
//      mapper: ArgosItemMapper[D]
//  ): Stream[F, ItemStockUpdates[D]]
//}
//
//trait CexStockService[F[_]] extends StockService[F, CexItem] {
//  def stockUpdates[D <: ItemDetails: CexItemMapper](config: StockMonitorConfig): Stream[F, ItemStockUpdates[D]]
//}
//
//trait SelfridgesSaleService[F[_]] extends StockService[F, SelfridgesItem] {
//  def stockUpdates[D <: ItemDetails: SelfridgesItemMapper](config: StockMonitorConfig): Stream[F, ItemStockUpdates[D]]
//}
