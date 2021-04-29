package ebayapp.core.tasks

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.clients.ItemMapper
import ebayapp.core.clients.argos.responses.ArgosItem
import ebayapp.core.clients.cex.responses.CexItem
import ebayapp.core.clients.jdsports.mappers.JdsportsItem
import ebayapp.core.clients.nvidia.responses.NvidiaItem
import ebayapp.core.clients.selfridges.mappers.SelfridgesItem
import ebayapp.core.common.config.{AppConfig, StockMonitorConfig}
import ebayapp.core.domain.ItemDetails.{Clothing, Generic}
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import fs2.Stream

import scala.concurrent.duration._

class StockMonitorSpec extends CatsSpec {

  "A StockMonitor" should {

    val updateGeneric  = ItemStockUpdates(ResellableItemBuilder.generic("Generic 1"), List(StockUpdate.New, StockUpdate.OutOfStock))
    val updateClothing = ItemStockUpdates(ResellableItemBuilder.clothing("Clothing 2"), List(StockUpdate.New))

    "get stock updates from various outlets" in {
      val services = servicesMock

      when(services.nvidiaStock.stockUpdates[Generic](any[StockMonitorConfig])(any[ItemMapper[NvidiaItem, Generic]]))
        .thenReturn(Stream.empty)
      when(services.argosStock.stockUpdates[Generic](any[StockMonitorConfig])(any[ItemMapper[ArgosItem, Generic]]))
        .thenReturn(Stream.sleep[IO](2.hours).drain)
      when(services.cexStock.stockUpdates[Generic](any[StockMonitorConfig])(any[ItemMapper[CexItem, Generic]]))
        .thenReturn(Stream.emit(updateGeneric))
      when(services.selfridgesSale.stockUpdates[Clothing](any[StockMonitorConfig])(any[ItemMapper[SelfridgesItem, Clothing]]))
        .thenReturn(Stream.emit(updateClothing))
      when(services.jdsportsSale.stockUpdates[Clothing](any[StockMonitorConfig])(any[ItemMapper[JdsportsItem, Clothing]]))
        .thenReturn(Stream.empty)
      when(services.notification.stockUpdate[Clothing](any[ResellableItem[Clothing]], any[StockUpdate])).thenReturn(IO.unit)
      when(services.notification.stockUpdate[Generic](any[ResellableItem[Generic]], any[StockUpdate])).thenReturn(IO.unit)

      val result = for {
        stockMonitor <- StockMonitor.make[IO](AppConfig.loadDefault, services)
        _            <- stockMonitor.run().interruptAfter(2.seconds).compile.drain
      } yield ()

      result.unsafeToFuture().map { res =>
        verify(services.nvidiaStock).stockUpdates(any[StockMonitorConfig])(any[ItemMapper[NvidiaItem, Generic]])
        verify(services.cexStock).stockUpdates(any[StockMonitorConfig])(any[ItemMapper[CexItem, Generic]])
        verify(services.argosStock).stockUpdates(any[StockMonitorConfig])(any[ItemMapper[ArgosItem, Generic]])
        verify(services.selfridgesSale).stockUpdates(any[StockMonitorConfig])(any[ItemMapper[SelfridgesItem, Clothing]])
        verify(services.jdsportsSale).stockUpdates(any[StockMonitorConfig])(any[ItemMapper[JdsportsItem, Clothing]])
        verify(services.notification).stockUpdate(updateGeneric.item, updateGeneric.updates.head)
        verify(services.notification).stockUpdate(updateGeneric.item, updateGeneric.updates.last)
        verify(services.notification).stockUpdate(updateClothing.item, updateClothing.updates.last)
        res mustBe ()
      }
    }
  }
}
