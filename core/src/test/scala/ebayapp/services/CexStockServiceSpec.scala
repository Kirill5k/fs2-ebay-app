package ebayapp.services

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.clients.cex.CexClient
import ebayapp.common.Cache
import ebayapp.common.config.{CexStockMonitorConfig, SearchQuery, StockMonitorRequest}
import ebayapp.domain.search.BuyPrice
import ebayapp.domain.stock.{ItemStockUpdates, StockUpdate}
import ebayapp.domain.ResellableItemBuilder

import scala.concurrent.duration._

class CexStockServiceSpec extends CatsSpec {

  val request = StockMonitorRequest(SearchQuery("macbook"), true, true)
  val config = CexStockMonitorConfig(10.minutes, 10.minutes, 1.seconds, List(request))

  val mb1 = ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 2, 1950.0)
  val mb2 = ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B")

  "A GenericStatefulCexStockService" should {

    "return empty list when there are no changes in items" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1, mb2)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(1.second).compile.toList

      result.unsafeToFuture().map { u =>
        verify(client, times(2)).findItem(request.query)
        u must be (Nil)
      }
    }

    "return new in stock update if cache previously had some items" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query))
        .thenReturn(IO.pure(Nil))
        .andThen(IO.pure(List(mb1)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(2.second).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.New)))
      }
    }

    "return stock increase update if quantity increase" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(1, 1950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(2.second).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.StockIncrease(1, 2))))
      }
    }

    "return stock decrease update if quantity decreased" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(3, 1950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(2.second).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.StockDecrease(3, 2))))
      }
    }

    "not return anything if stock monitor is disabled" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(3, 1950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service
        .stockUpdates(config.copy(monitoringRequests = List(request.copy(monitorStockChange = false))))
        .interruptAfter(2.second)
        .compile
        .toList

      result.unsafeToFuture().map { u =>
        u must be (Nil)
      }
    }

    "return price increase update if price increase" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(2.second).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.PriceRaise(BigDecimal(950.0), BigDecimal(1950.0)))))
      }
    }

    "return price drop update if price decrease" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 2950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(2.second).compile.toList

      result.unsafeToFuture().map { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.PriceDrop(BigDecimal(2950.0), BigDecimal(1950.0)))))
      }
    }

    "return multiple price drop updates" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 4950.0)))))
        .andThen(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 3950.0)))))
        .andThen(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 2950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(6.second).compile.toList

      result.unsafeToFuture().map { u =>
        u must have size 3
      }
    }

    "non return anything if monitor is disabled for price" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query))
        .thenReturn(IO.pure(List(mb1.copy(buyPrice = BuyPrice(2, 2950.0)))))
        .andThen(IO.pure(List(mb1)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service
        .stockUpdates(config.copy(monitoringRequests = List(request.copy(monitorPriceChange = false, monitorStockChange = false))))
        .interruptAfter(2.second)
        .compile
        .toList

      result.unsafeToFuture().map { u =>
        u must be (Nil)
      }
    }
  }

  def mocks: (CexClient[IO], Cache[IO, String, Unit], Cache[IO, String, BuyPrice]) = {
    val client = mock[CexClient[IO]]
    val search = mock[Cache[IO, String, Unit]]
    val items = mock[Cache[IO, String, BuyPrice]]
    (client, search, items)
  }
}
