package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.clients.{Retailer, SearchClient}
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItemBuilder.clothing
import ebayapp.core.domain.search.SearchCriteria
import fs2.Stream

import scala.concurrent.duration.*

class SelfridgesSaleServiceSpec extends CatsSpec {

  val criteria = SearchCriteria("foo", minDiscount = Some(50), excludeFilters = Some(List("ignore-me", "SKIP-ME")))
  val config   = StockMonitorConfig(1.second, List(StockMonitorRequest(criteria, true, true)))

  "A SelfridgesSaleService" should {

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
  }
}
