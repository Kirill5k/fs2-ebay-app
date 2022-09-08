package ebayapp.core.tasks

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}
import fs2.Stream

import scala.concurrent.duration.*

class StockMonitorSpec extends CatsSpec {

  "A StockMonitor" should {

    val updateClothing = ItemStockUpdates(ResellableItemBuilder.clothing("Clothing 2"), List(StockUpdate.New))

    "get stock updates from various outlets" in {
      val services = servicesMock

      when(services.stock.head.stockUpdates).thenReturn(Stream.empty)
      when(services.stock.drop(1).head.stockUpdates).thenReturn(Stream.sleep[IO](2.hours).drain)
      when(services.stock.drop(2).head.stockUpdates).thenReturn(Stream.emit(updateClothing))
      when(services.notification.stockUpdate(any[ResellableItem], any[StockUpdate])).thenReturn(IO.unit)

      val result = for {
        stockMonitor <- StockMonitor.make[IO](services)
        _            <- stockMonitor.run.interruptAfter(2.seconds).compile.drain
      } yield ()

      result.asserting { res =>
        verify(services.stock.head).stockUpdates
        verify(services.stock.drop(1).head).stockUpdates
        verify(services.stock.drop(2).head).stockUpdates
        verify(services.notification).stockUpdate(updateClothing.item, updateClothing.updates.last)
        res mustBe ()
      }
    }
  }
}
