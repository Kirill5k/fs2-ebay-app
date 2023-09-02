package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.{IOWordSpec, MockConfigProvider}
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder as Builder, Retailer}
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria}
import ebayapp.core.domain.stock.{ItemStockUpdates, StockUpdate}
import org.mockito.Mockito.atLeast as atLeastTimes

import java.time.Instant
import scala.concurrent.duration.*

class CexStockServiceSpec extends IOWordSpec {

  val req1 = StockMonitorRequest(SearchCriteria("macbook"), true, true)
  val req2 = StockMonitorRequest(SearchCriteria("iphone"), true, true)

  def config(req: StockMonitorRequest*) =
    MockConfigProvider.make[IO](stockMonitorConfigs = Map(Retailer.Cex -> StockMonitorConfig(1.seconds, req.toList)))

  val ts  = Instant.now()
  val mb1 = Builder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", 2, 1950.0, datePosted = ts)
  val mb2 = Builder.generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B", datePosted = ts)

  "A GenericStatefulCexStockService" should {

    "monitor multiple requests concurrently" in {
      val client = mock[CexClient[IO]]
      when(client.search(any[SearchCriteria])).thenReturnEmptyStream

      val result = StockService
        .make[IO](Retailer.Cex, config(req1, req2), client)
        .flatMap { svc =>
          svc.stockUpdates
            .interruptAfter(1300.millis)
            .compile
            .toList
        }

      result.asserting { u =>
        verify(client, atLeastTimes(2)).search(req1.searchCriteria)
        verify(client, atLeastTimes(1)).search(req2.searchCriteria)
        u mustBe Nil
      }
    }

    "return new in stock update if cache previously had some items" in {
      val client = mock[CexClient[IO]]

      when(client.search(req1.searchCriteria)).thenReturnEmptyStream
        .thenStream(mb1)

      val result = StockService
        .make[IO](Retailer.Cex, config(req1), client)
        .flatMap(_.stockUpdates.interruptAfter(2200.millis).compile.toList)

      result.asserting { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.New)))
      }
    }

    "return stock increase update if quantity increase" in {
      val client = mock[CexClient[IO]]

      when(client.search(req1.searchCriteria))
        .thenStream(mb1.withPrice(BuyPrice(1, 1950.0), ts.minusSeconds(1)))
        .thenStream(mb1)

      val result = StockService
        .make[IO](Retailer.Cex, config(req1), client)
        .flatMap(_.stockUpdates.interruptAfter(2200.millis).compile.toList)

      result.asserting { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.StockIncrease(1, 2))))
      }
    }

    "return stock decrease update if quantity decreased" in {
      val client = mock[CexClient[IO]]

      when(client.search(req1.searchCriteria))
        .thenStream(mb1.withPrice(BuyPrice(3, 1950.0), ts.minusSeconds(1)))
        .thenStream(mb1)

      val result = StockService
        .make[IO](Retailer.Cex, config(req1), client)
        .flatMap(_.stockUpdates.interruptAfter(2200.millis).compile.toList)

      result.asserting { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.StockDecrease(3, 2))))
      }
    }

    "not return anything if stock monitor is disabled" in {
      val client = mock[CexClient[IO]]

      when(client.search(req1.searchCriteria))
        .thenStream(mb1.withPrice(BuyPrice(3, 1950.0), ts.minusSeconds(1)))
        .thenStream(mb1)

      val result = StockService
        .make[IO](Retailer.Cex, config(req1.copy(monitorStockChange = false)), client)
        .flatMap {
          _.stockUpdates
            .interruptAfter(2.second)
            .compile
            .toList
        }

      result.asserting { u =>
        u mustBe Nil
      }
    }

    "return price increase update if price increase" in {
      val client = mock[CexClient[IO]]
      when(client.search(req1.searchCriteria))
        .thenStream(mb1.withPrice(BuyPrice(2, 950.0), ts.minusSeconds(1)))
        .thenStream(mb1)

      val result = StockService
        .make[IO](Retailer.Cex, config(req1), client)
        .flatMap(_.stockUpdates.interruptAfter(2200.millis).compile.toList)

      result.asserting { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.PriceRaise(BigDecimal(950.0), BigDecimal(1950.0)))))
      }
    }

    "return price drop update if price decrease" in {
      val client = mock[CexClient[IO]]
      when(client.search(req1.searchCriteria))
        .thenStream(mb1.withPrice(BuyPrice(2, 2950.0), ts.minusSeconds(1)))
        .thenStream(mb1)

      val result = StockService
        .make[IO](Retailer.Cex, config(req1), client)
        .flatMap(_.stockUpdates.interruptAfter(2200.millis).compile.toList)

      result.asserting { u =>
        u mustBe List(ItemStockUpdates(mb1, List(StockUpdate.PriceDrop(BigDecimal(2950.0), BigDecimal(1950.0)))))
      }
    }

    "return multiple price drop updates" in {
      val client = mock[CexClient[IO]]
      when(client.search(req1.searchCriteria))
        .thenStream(mb1.withPrice(BuyPrice(2, 4950.0), ts.minusSeconds(3)))
        .thenStream(mb1.withPrice(BuyPrice(2, 3950.0), ts.minusSeconds(2)))
        .thenStream(mb1.withPrice(BuyPrice(2, 2950.0), ts.minusSeconds(1)))
        .thenStream(mb1)

      val result = StockService
        .make[IO](Retailer.Cex, config(req1), client)
        .flatMap(_.stockUpdates.interruptAfter(6200.millis).compile.toList)

      result.asserting { u =>
        u must have size 3
      }
    }

    "non return anything if monitor is disabled for price" in {
      val client = mock[CexClient[IO]]
      when(client.search(req1.searchCriteria))
        .thenStream(mb1.withPrice(BuyPrice(2, 2950.0)))
        .thenStream(mb1.withDatePosted(ts.minusSeconds(1)))

      val result = StockService
        .make[IO](Retailer.Cex, config(req1.copy(monitorPriceChange = false, monitorStockChange = false)), client)
        .flatMap {
          _.stockUpdates
            .interruptAfter(2200.millis)
            .compile
            .toList
        }

      result.asserting { u =>
        u mustBe Nil
      }
    }

    "return updates for multiple items" in {
      val client = mock[CexClient[IO]]

      when(client.search(req1.searchCriteria))
        .thenStream(mb1.withPrice(BuyPrice(3, 3000.0)), mb2.withPrice(BuyPrice(3, 3000.0)))
        .thenStream(mb1.withDatePosted(ts.plusSeconds(1)), mb2.withDatePosted(ts.plusSeconds(1)))

      val result = StockService
        .make[IO](Retailer.Cex, config(req1), client)
        .flatMap(_.stockUpdates.interruptAfter(2200.millis).compile.toList)

      result.asserting { u =>
        u must have size 2
        u.flatMap(_.updates) must have size 4
      }
    }

    "not return anything when notifyOnChange is false" in {
      val client = mock[CexClient[IO]]

      val req = req1.copy(notifyOnChange = Some(false))

      when(client.search(req.searchCriteria)).thenReturnEmptyStream
        .thenStream(mb1)

      val result = StockService
        .make[IO](Retailer.Cex, config(req), client)
        .flatMap(_.stockUpdates.interruptAfter(2200.millis).compile.toList)

      result.asserting(_ mustBe Nil)
    }
  }

  extension (item: ResellableItem)
    def withDatePosted(datePosted: Instant): ResellableItem =
      item.copy(listingDetails = item.listingDetails.copy(datePosted = datePosted))
    def withPrice(price: BuyPrice): ResellableItem =
      withPrice(price, item.listingDetails.datePosted)
    def withPrice(price: BuyPrice, datePosted: Instant): ResellableItem =
      item.copy(
        buyPrice = price,
        listingDetails = item.listingDetails.copy(datePosted = datePosted)
      )
}
