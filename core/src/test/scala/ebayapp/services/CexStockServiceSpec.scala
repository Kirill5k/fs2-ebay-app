package ebayapp.services

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.clients.cex.CexClient
import ebayapp.common.Cache
import ebayapp.common.config.{SearchQuery, StockMonitorRequest}
import ebayapp.domain.ItemDetails.Generic
import ebayapp.domain.stock.{StockUpdate, StockUpdateType}
import ebayapp.domain.{ResellableItem, ResellableItemBuilder}

class CexStockServiceSpec extends CatsSpec {

  val request = StockMonitorRequest(SearchQuery("macbook"), true, true)

  val mb1 = ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 2, 1950.0)
  val mb2 = ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B")

  "A GenericStatefulCexStockService" should {

    "return empty list if cache is empty" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1, mb2)))
      when(searchHistory.contains(any[SearchQuery])).thenReturn(IO.pure(false))

      val service = new StatefulCexStockService[IO, Generic](client, searchHistory, itemsCache)
      val result = service.getUpdates(request)

      result.unsafeToFuture().map { u =>
        verify(client).findItem(request.query)
        verify(searchHistory).contains(request.query)
        verify(searchHistory).put(request.query, ())
        verify(itemsCache).put(eqTo("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A"), any[ResellableItem[Generic]])
        verify(itemsCache).put(eqTo("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B"), any[ResellableItem[Generic]])
        u must be (Nil)
      }
    }

    "return new in stock update if cache previously had some items" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1, mb2)))
      when(searchHistory.contains(any[SearchQuery])).thenReturn(IO.pure(true))
      when(itemsCache.get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")).thenReturn(IO.pure(Some(mb1)))
      when(itemsCache.get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B")).thenReturn(IO.pure(None))

      val service = new StatefulCexStockService[IO, Generic](client, searchHistory, itemsCache)
      val result = service.getUpdates(request)

      result.unsafeToFuture().map { u =>
        verify(client).findItem(request.query)
        verify(searchHistory).put(request.query, ())
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1)
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B", mb2)
        u must be (List(StockUpdate(StockUpdateType.New, mb2)))
      }
    }

    "return empty if no changes" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[SearchQuery])).thenReturn(IO.pure(true))
      when(itemsCache.get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")).thenReturn(IO.pure(Some(mb1)))

      val service = new StatefulCexStockService[IO, Generic](client, searchHistory, itemsCache)
      val result = service.getUpdates(request)

      result.unsafeToFuture().map { u =>
        verify(searchHistory).put(request.query, ())
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1)
        u must be (Nil)
      }
    }

    "return stock increase update if quantity increase" in {
      val (client, searchHistory, itemsCache) = mocks

      when(searchHistory.contains(any[SearchQuery])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", price = 1950.0))))
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))

      val service = new StatefulCexStockService[IO, Generic](client, searchHistory, itemsCache)
      val result = service.getUpdates(request)

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1)
        verify(searchHistory).put(request.query, ())
        u must be (List(StockUpdate(StockUpdateType.StockIncrease(1, 2), mb1)))
      }
    }

    "return stock decrease update if quantity decreased" in {
      val (client, searchHistory, itemsCache) = mocks

      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[SearchQuery])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 3, 1950.0))))

      val service = new StatefulCexStockService[IO, Generic](client, searchHistory, itemsCache)
      val result = service.getUpdates(request)

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1)
        verify(searchHistory).put(request.query, ())
        u must be (List(StockUpdate(StockUpdateType.StockDecrease(3, 2), mb1)))
      }
    }

    "non return anything if stock monitor is disabled" in {
      val (client, searchHistory, itemsCache) = mocks

      when(searchHistory.contains(any[SearchQuery])).thenReturn(IO.pure(true))
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 3, 1950.0))))

      val service = new StatefulCexStockService[IO, Generic](client, searchHistory, itemsCache)
      val result = service.getUpdates(request.copy(monitorStockChange = false))

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1)
        verify(searchHistory).put(request.query, ())
        u must be (Nil)
      }
    }

    "return price increase update if price increase" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[SearchQuery])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 2, 950.0))))

      val service = new StatefulCexStockService[IO, Generic](client, searchHistory, itemsCache)
      val result = service.getUpdates(request)

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1)
        verify(searchHistory).put(request.query, ())
        u must be (List(StockUpdate(StockUpdateType.PriceRaise(BigDecimal(950.0), BigDecimal(1950.0)), mb1)))
      }
    }

    "return price drop update if price decrease" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[SearchQuery])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 2, 2950.0))))

      val service = new StatefulCexStockService[IO, Generic](client, searchHistory, itemsCache)
      val result = service.getUpdates(request)

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1)
        verify(searchHistory).put(request.query, ())
        u must be (List(StockUpdate(StockUpdateType.PriceDrop(BigDecimal(2950.0), BigDecimal(1950.0)), mb1)))
      }
    }

    "non return anything if monitor is disabled for price" in {
      val (client, searchHistory, itemsCache) = mocks
      when(client.findItem(request.query)).thenReturn(IO.pure(List(mb1)))
      when(searchHistory.contains(any[SearchQuery])).thenReturn(IO.pure(true))
      when(itemsCache.get(any[String])).thenReturn(IO.pure(Some(ResellableItemBuilder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 2, 2950.0))))

      val service = new StatefulCexStockService[IO, Generic](client, searchHistory, itemsCache)
      val result = service.getUpdates(request.copy(monitorPriceChange = false, monitorStockChange = false))

      result.unsafeToFuture().map { u =>
        verify(itemsCache).get("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A")
        verify(itemsCache).put("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", mb1)
        verify(searchHistory).put(request.query, ())
        u must be (Nil)
      }
    }
  }

  def mocks: (CexClient[IO], Cache[IO, SearchQuery, Unit], Cache[IO, String, ResellableItem[Generic]]) = {
    val client = mock[CexClient[IO]]
    val search = mock[Cache[IO, SearchQuery, Unit]]
    val items = mock[Cache[IO, String, ResellableItem[Generic]]]
    when(search.put(any[SearchQuery], any[Unit])).thenReturn(IO.unit)
    when(items.put(any[String], any[ResellableItem[Generic]])).thenReturn(IO.unit)
    (client, search, items)
  }
}
