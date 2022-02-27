package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.clients.{Retailer, SearchClient, SearchCriteria}
import ebayapp.core.common.config.{StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ResellableItemBuilder.clothing
import fs2.Stream

import scala.concurrent.duration._

class SelfridgesSaleServiceSpec extends CatsSpec {

  val criteria = SearchCriteria("foo", minDiscount = Some(50))
  val config   = StockMonitorConfig(1.second, List(StockMonitorRequest(criteria, true, true)))

  "A LiveSelfridgesSaleService" should {

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

      result.unsafeToFuture().map { updates =>
        updates must have size 1
        updates.head.item.itemDetails.fullName mustBe Some("Foo-bar - T-shirt cheap, size XXL")
      }
    }
  }
}
