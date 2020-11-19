package ebayapp.services

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.clients.cex.CexClient
import ebayapp.clients.cex.mappers.CexItemMapper
import ebayapp.common.config.{CexStockMonitorConfig, SearchQuery, StockMonitorRequest}
import ebayapp.domain.search.BuyPrice
import ebayapp.domain.stock.{ItemStockUpdates, StockUpdate}
import ebayapp.domain.{ItemDetails, ResellableItemBuilder}

import scala.concurrent.duration._

class CexStockServiceSpec extends CatsSpec {

  val req1 = StockMonitorRequest(SearchQuery("macbook"), true, true)
  val req2 = StockMonitorRequest(SearchQuery("iphone"), true, true)
  val config = CexStockMonitorConfig(1.seconds, List(req1))

  val mb1 = ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 2, 1950.0)
  val mb2 = ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B")

  "A GenericStatefulCexStockService" should {

    "return empty list when there are no changes in items" in {
      val client = mock[CexClient[IO]]

      when(client.findItem(req1.query)).thenReturn(IO.pure(List(mb1, mb2)))

      val service = new LiveCexStockService[IO](client)
      val result = service.stockUpdates(config).interruptAfter(1100.millis).compile.toList

      result.unsafeToFuture().map { u =>
        verify(client, times(2)).findItem(req1.query)
        u must be (Nil)
      }
    }

    "monitor multiple requests concurrently" in {
      val client = mock[CexClient[IO]]

      when(client.findItem(any[SearchQuery])(any[CexItemMapper[ItemDetails.Generic]])).thenReturn(IO.pure(Nil))

      val service = new LiveCexStockService[IO](client)
      val result = service.stockUpdates(config.copy(monitoringRequests = List(req1, req2))).interruptAfter(1100.millis).compile.toList

      result.unsafeToFuture().map { u =>
        verify(client, atLeast(2)).findItem(req1.query)
        verify(client, atLeast(2)).findItem(req2.query)
        u must be (Nil)
      }
    }

    "return new in stock update if cache previously had some items" in {
      val client = mock[CexClient[IO]]

      when(client.findItem(req1.query))
        .thenReturn(IO.pure(Nil))
        .andThen(IO.pure(List(mb1)))

      val service = new LiveCexStockService[IO](client)
      val result = service.stockUpdates(config).interruptAfter(2200.millis).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.New)))
      }
    }

    "return stock increase update if quantity increase" in {
      val client = mock[CexClient[IO]]

      when(client.findItem(req1.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(1, 1950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new LiveCexStockService[IO](client)
      val result = service.stockUpdates(config).interruptAfter(2200.millis).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.StockIncrease(1, 2))))
      }
    }

    "return stock decrease update if quantity decreased" in {
      val client = mock[CexClient[IO]]

      when(client.findItem(req1.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(3, 1950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new LiveCexStockService[IO](client)
      val result = service.stockUpdates(config).interruptAfter(2200.millis).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.StockDecrease(3, 2))))
      }
    }

    "not return anything if stock monitor is disabled" in {
      val client = mock[CexClient[IO]]

      when(client.findItem(req1.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(3, 1950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new LiveCexStockService[IO](client)
      val result = service
        .stockUpdates(config.copy(monitoringRequests = List(req1.copy(monitorStockChange = false))))
        .interruptAfter(2.second)
        .compile
        .toList

      result.unsafeToFuture().map { u =>
        u must be (Nil)
      }
    }

    "return price increase update if price increase" in {
      val client = mock[CexClient[IO]]
      when(client.findItem(req1.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new LiveCexStockService[IO](client)
      val result = service.stockUpdates(config).interruptAfter(2200.millis).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.PriceRaise(BigDecimal(950.0), BigDecimal(1950.0)))))
      }
    }

    "return price drop update if price decrease" in {
      val client = mock[CexClient[IO]]
      when(client.findItem(req1.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 2950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new LiveCexStockService[IO](client)
      val result = service.stockUpdates(config).interruptAfter(2200.millis).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.PriceDrop(BigDecimal(2950.0), BigDecimal(1950.0)))))
      }
    }

    "return multiple price drop updates" in {
      val client = mock[CexClient[IO]]
      when(client.findItem(req1.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 4950.0)))))
        .andThen(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 3950.0)))))
        .andThen(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 2950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new LiveCexStockService[IO](client)
      val result = service.stockUpdates(config).interruptAfter(6200.millis).compile.toList

      result.unsafeToFuture().map { u =>
        u must have size 3
      }
    }

    "non return anything if monitor is disabled for price" in {
      val client = mock[CexClient[IO]]
      when(client.findItem(req1.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 2950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new LiveCexStockService[IO](client)
      val result = service
        .stockUpdates(config.copy(monitoringRequests = List(req1.copy(monitorPriceChange = false, monitorStockChange = false))))
        .interruptAfter(2200.millis)
        .compile
        .toList

      result.unsafeToFuture().map { u =>
        u must be (Nil)
      }
    }

    "return updates for multiple items" in {
      val client = mock[CexClient[IO]]

      when(client.findItem(req1.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(3, 3000.0)), mb2.copy(buyPrice = BuyPrice(3, 3000.0)))))
        .andThen(IO.pure(List(mb1, mb2)))

      val service = new LiveCexStockService[IO](client)
      val result = service.stockUpdates(config).interruptAfter(2200.millis).compile.toList

      result.unsafeToFuture().map { u =>
        u must have size 2
        u.flatMap(_.updates) must have size 4
      }
    }
  }
}
