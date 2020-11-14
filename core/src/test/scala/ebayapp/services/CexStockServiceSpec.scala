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
  val config = CexStockMonitorConfig(10.minutes, 10.minutes, 5.seconds, List(request))

  val mb1 = ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 2, 1950.0)
  val mb2 = ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B")

  "A GenericStatefulCexStockService" should {

    "return empty list if cache is empty" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1, mb2)))
      when(searchHistory.contains(any[String])).thenReturn(IO.pure(false))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(1.second).compile.toList

      result.unsafeToFuture().map { u =>
        verify(client).findItem(request.query)
        verify(searchHistory).contains(request.query.base64)
        verify(searchHistory).put(request.query.base64, ())
        verify(itemsCache).put(eqTo("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A"), any[BuyPrice])
        verify(itemsCache).put(eqTo("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B"), any[BuyPrice])
        u must be (Nil)
      }
    }

    "return new in stock update if cache previously had some items" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1, mb2)))
      when(searchHistory.contains(any[String])).thenReturn(IO.pure(true))
      when(itemsCache.get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")).thenReturn(IO.pure(Some(mb1.buyPrice)))
      when(itemsCache.get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B")).thenReturn(IO.pure(None))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(1.second).compile.toList

      result.unsafeToFuture().map { u =>
        verify(client).findItem(request.query)
        verify(searchHistory).put(request.query.base64, ())
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1.buyPrice)
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B", mb2.buyPrice)
        u mustBe List(ItemStockUpdates(mb2, List(StockUpdate.New)))
      }
    }

    "return empty if no changes" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[String])).thenReturn(IO.pure(true))
      when(itemsCache.get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")).thenReturn(IO.pure(Some(mb1.buyPrice)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(1.second).compile.toList

      result.unsafeToFuture().map { u =>
        verify(searchHistory).put(request.query.base64, ())
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1.buyPrice)
        u must be (Nil)
      }
    }

    "return stock increase update if quantity increase" in {
      val (client, searchHistory, itemsCache) = mocks

      when(searchHistory.contains(any[String])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(BuyPrice(1, 1950.0))))
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(1.second).compile.toList

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1.buyPrice)
        verify(searchHistory).put(request.query.base64, ())
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.StockIncrease(1, 2))))
      }
    }

    "return stock decrease update if quantity decreased" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[String])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(BuyPrice(3, 1950.0))))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(1.second).compile.toList

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1.buyPrice)
        verify(searchHistory).put(request.query.base64, ())
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.StockDecrease(3, 2))))
      }
    }

    "non return anything if stock monitor is disabled" in {
      val (client, searchHistory, itemsCache) = mocks

      when(searchHistory.contains(any[String])).thenReturn(IO.pure(true))
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(BuyPrice(3, 1950.0))))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service
        .stockUpdates(config.copy(monitoringRequests = List(request.copy(monitorStockChange = false))))
        .interruptAfter(1.second)
        .compile
        .toList

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1.buyPrice)
        verify(searchHistory).put(request.query.base64, ())
        u must be (Nil)
      }
    }

    "return price increase update if price increase" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[String])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(BuyPrice(2, 950.0))))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(1.second).compile.toList

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1.buyPrice)
        verify(searchHistory).put(request.query.base64, ())
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.PriceRaise(BigDecimal(950.0), BigDecimal(1950.0)))))
      }
    }

    "return price drop update if price decrease" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[String])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(BuyPrice(2, 2950.0))))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service.stockUpdates(config).interruptAfter(1.second).compile.toList

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1.buyPrice)
        verify(searchHistory).put(request.query.base64, ())
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.PriceDrop(BigDecimal(2950.0), BigDecimal(1950.0)))))
      }
    }

    "non return anything if monitor is disabled for price" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[String])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(BuyPrice(2, 2950.0))))

      val service = new RefbasedlCexStockService[IO](client, searchHistory, itemsCache)
      val result = service
        .stockUpdates(config.copy(monitoringRequests = List(request.copy(monitorPriceChange = false, monitorStockChange = false))))
        .interruptAfter(1.second)
        .compile
        .toList

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1.buyPrice)
        verify(searchHistory).put(request.query.base64, ())
        u must be (Nil)
      }
    }
  }

  def mocks: (CexClient[IO], Cache[IO, String, Unit], Cache[IO, String, BuyPrice]) = {
    val client = mock[CexClient[IO]]
    val search = mock[Cache[IO, String, Unit]]
    val items = mock[Cache[IO, String, BuyPrice]]
    when(search.put(any[String], any[Unit])).thenReturn(IO.unit)
    when(items.put(any[String], any[BuyPrice])).thenReturn(IO.unit)
    (client, search, items)
  }
}
