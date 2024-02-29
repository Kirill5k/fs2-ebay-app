package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.{MockConfigProvider, MockLogger}
import ebayapp.core.clients.SearchClient
import ebayapp.core.common.{ConfigProvider, Logger}
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItemBuilder.makeClothing
import ebayapp.core.domain.Retailer
import ebayapp.core.domain.search.{Filters, SearchCriteria}
import kirill5k.common.test.cats.IOWordSpec
import fs2.Stream
import org.mockito.Mockito

import scala.concurrent.duration.*

class SelfridgesStockServiceSpec extends IOWordSpec {

  given Logger[IO] = MockLogger.make[IO]

  val scLimits           = Filters(Some(50), Some(List("SC-IGNORE", "SC-SKIP")), None)
  val criteria           = SearchCriteria("foo", filters = Some(scLimits))
  val anotherCriteria    = SearchCriteria("bar", filters = Some(scLimits))
  val yetAnotherCriteria = SearchCriteria("baz", filters = Some(scLimits))
  val stockMonitorConfig = StockMonitorConfig(1.second, List(StockMonitorRequest(criteria, true, true)))

  def config(config: StockMonitorConfig = stockMonitorConfig) =
    MockConfigProvider.make[IO](stockMonitorConfigs = Map(Retailer.Selfridges -> config))

  "A SelfridgesStockService" should {

    "return items with discount greater than min" in {
      val items = List(
        makeClothing("T-shirt rrp", discount = None),
        makeClothing("T-shirt expensive", discount = Some(10)),
        makeClothing("T-shirt cheap", discount = Some(96))
      )

      val client = mock[SearchClient[IO]]
      when(client.search(any[SearchCriteria]))
        .thenReturn(Stream.empty, Stream.emits(items))

      val result = StockService
        .make[IO](Retailer.Selfridges, config(), client)
        .flatMap(_.stockUpdates.interruptAfter(2.seconds).compile.toList)

      result.asserting { updates =>
        updates must have size 1
        updates.head.item.itemDetails.fullName mustBe Some("Foo-bar - T-shirt cheap, size XXL")
      }
    }

    "ignore items that are excluded with filter from SearchCriteria" in {
      val items = List(
        makeClothing("T-shirt Sc-Ignore", discount = Some(80)),
        makeClothing("T-shirt Sc-Skip", discount = Some(80)),
        makeClothing("T-shirt", discount = Some(80))
      )

      val client = mock[SearchClient[IO]]
      when(client.search(any[SearchCriteria]))
        .thenReturn(Stream.empty, Stream.emits(items))

      val result = StockService
        .make[IO](Retailer.Selfridges, config(), client)
        .flatMap(_.stockUpdates.interruptAfter(2.seconds).compile.toList)

      result.asserting { updates =>
        updates must have size 1
        updates.head.item.itemDetails.fullName mustBe Some("Foo-bar - T-shirt, size XXL")
      }
    }

    "ignore items that are excluded with filter from StockMonitorConfig" in {
      val items = List(
        makeClothing("T-shirt conf-skip", discount = Some(80)),
        makeClothing("T-shirt size 7", discount = Some(80)),
        makeClothing("T-shirt size 12Y", discount = Some(80)),
        makeClothing("T-shirt", discount = Some(80))
      )

      val client = mock[SearchClient[IO]]
      when(client.search(any[SearchCriteria]))
        .thenReturn(Stream.empty, Stream.emits(items))

      val limits = Filters(None, Some(List("conf-skip", "size \\d+Y", "size [1-7]")), None)
      val result = StockService
        .make[IO](Retailer.Selfridges, config(stockMonitorConfig.copy(filters = Some(limits))), client)
        .flatMap(_.stockUpdates.interruptAfter(2.seconds).compile.toList)

      result.asserting { updates =>
        updates must have size 1
        updates.head.item.itemDetails.fullName mustBe Some("Foo-bar - T-shirt, size XXL")
      }
    }

    "reload stream when config changes" in {
      val items = List(
        makeClothing("T-shirt sc-ignore", discount = Some(80)),
        makeClothing("T-shirt sc-skip", discount = Some(80)),
        makeClothing("T-shirt", discount = Some(80))
      )

      val configProvider = mock[ConfigProvider[IO]]
      when(configProvider.stockMonitor(any[Retailer]))
        .thenReturn(
          Stream(stockMonitorConfig) ++
            Stream.sleep_[IO](1500.millis) ++
            Stream(StockMonitorConfig(1.second, List(StockMonitorRequest(anotherCriteria, true, true)))) ++
            Stream.sleep_[IO](1500.millis) ++
            Stream(StockMonitorConfig(1.second, List(StockMonitorRequest(yetAnotherCriteria, true, true))))
        )

      val client = mock[SearchClient[IO]]
      when(client.search(criteria)).thenReturnEmptyStream
      when(client.search(anotherCriteria)).thenReturnEmptyStream
      when(client.search(yetAnotherCriteria)).thenReturn(Stream.empty, Stream.emits(items))

      val result = StockService
        .make[IO](Retailer.Selfridges, configProvider, client)
        .flatMap(_.stockUpdates.interruptAfter(5.seconds).compile.toList)

      result.asserting { updates =>
        verify(client, Mockito.times(2)).search(criteria)
        verify(client, Mockito.times(2)).search(anotherCriteria)
        verify(client, Mockito.times(2)).search(yetAnotherCriteria)
        updates must have size 1
        updates.head.item.itemDetails.fullName mustBe Some("Foo-bar - T-shirt, size XXL")
      }
    }
  }
}
