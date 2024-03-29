package ebayapp.core.tasks

import cats.effect.IO
import kirill5k.common.cats.test.IOWordSpec
import ebayapp.core.MockServices
import ebayapp.core.domain.ResellableItemBuilder.makeClothing
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}
import fs2.Stream

import scala.concurrent.duration.*

class StockMonitorSpec extends IOWordSpec {

  "A StockMonitor" should {

    val updateClothing = ItemStockUpdates(makeClothing("Clothing 2"), List(StockUpdate.New))

    "get stock updates from various outlets" in {
      val services = MockServices.make

      when(services.stock.head.stockUpdates).thenReturnEmptyStream
      when(services.stock.drop(1).head.stockUpdates).thenReturn(Stream.sleep[IO](2.hours).drain)
      when(services.stock.drop(2).head.stockUpdates).thenStream(updateClothing)
      when(services.notification.stockUpdate(any[ResellableItem], any[StockUpdate])).thenReturnUnit

      val result = for
        stockMonitor <- StockMonitor.make[IO](services)
        _            <- stockMonitor.run.interruptAfter(2.seconds).compile.drain
      yield ()

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
