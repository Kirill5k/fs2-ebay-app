package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.{CatsSpec, MockConfigProvider}
import ebayapp.core.clients.SearchClient
import ebayapp.core.common.ConfigProvider
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItemBuilder.clothing
import ebayapp.core.domain.Retailer
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream
import org.mockito.Mockito

import scala.concurrent.duration.*

class SelfridgesStockServiceSpec extends CatsSpec {

  val criteria           = SearchCriteria("foo", minDiscount = Some(50), excludeFilters = Some(List("ignore-me", "SKIP-ME")))
  val anotherCriteria    = SearchCriteria("bar", minDiscount = Some(50), excludeFilters = Some(List("ignore-me", "SKIP-ME")))
  val yetAnotherCriteria = SearchCriteria("baz", minDiscount = Some(50), excludeFilters = Some(List("ignore-me", "SKIP-ME")))
  val stockMonitorConfig = StockMonitorConfig(1.second, List(StockMonitorRequest(criteria, true, true)))
  val config             = MockConfigProvider.make[IO](stockMonitorConfigs = Map(Retailer.Selfridges -> stockMonitorConfig))

  "A SelfridgesStockService" should {

    "return items with discount greater than min" in {
      val items = List(
        clothing("T-shirt rrp", discount = None),
        clothing("T-shirt expensive", discount = Some(10)),
        clothing("T-shirt cheap", discount = Some(96))
      )

      val client = mock[SearchClient[IO]]
      when(client.search(any[SearchCriteria]))
        .thenReturn(Stream.empty, Stream.emits(items))

      val result = StockService
        .make[IO](Retailer.Selfridges, config, client)
        .flatMap(_.stockUpdates.interruptAfter(2.seconds).compile.toList)

      result.asserting { updates =>
        updates must have size 1
        updates.head.item.itemDetails.fullName mustBe Some("Foo-bar - T-shirt cheap, size XXL")
      }
    }

    "ignore items that are excluded" in {
      val items = List(
        clothing("T-shirt ignore-me", discount = Some(80)),
        clothing("T-shirt skip-me", discount = Some(80)),
        clothing("T-shirt", discount = Some(80))
      )

      val client = mock[SearchClient[IO]]
      when(client.search(any[SearchCriteria]))
        .thenReturn(Stream.empty, Stream.emits(items))

      val result = StockService
        .make[IO](Retailer.Selfridges, config, client)
        .flatMap(_.stockUpdates.interruptAfter(2.seconds).compile.toList)

      result.asserting { updates =>
        updates must have size 1
        updates.head.item.itemDetails.fullName mustBe Some("Foo-bar - T-shirt, size XXL")
      }
    }

    "reload stream when config changes" in {
      val items = List(
        clothing("T-shirt ignore-me", discount = Some(80)),
        clothing("T-shirt skip-me", discount = Some(80)),
        clothing("T-shirt", discount = Some(80))
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
      when(client.search(criteria)).thenReturn(Stream.empty)
      when(client.search(anotherCriteria)).thenReturn(Stream.empty)
      when(client.search(yetAnotherCriteria)).thenReturn(Stream.empty, Stream.emits(items))

      val result = StockService
        .make[IO](Retailer.Selfridges, configProvider, client)
        .flatMap(_.stockUpdates.interruptAfter(4500.millis).compile.toList)

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
