package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.clients.selfridges.SelfridgesClient
import ebayapp.core.clients.selfridges.mappers._
import ebayapp.core.common.config.{SearchQuery, StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.ItemDetails
import ebayapp.core.domain.ResellableItemBuilder.clothing
import fs2.Stream

import scala.concurrent.duration._

class SelfridgesSaleServiceSpec extends CatsSpec {

  val query  = SearchQuery("foo")
  val config = StockMonitorConfig(1.second, List(StockMonitorRequest(SearchQuery("foo"), true, true, minDiscount = Some(50))))

  "A LiveSelfridgesSaleService" should {

    "exclude unwanted items" in {
      val unwantedItems = List(
        clothing("T-shirt"),
        clothing("Jersey t-shirt bra"),
        clothing("Stretch-mesh thong"),
        clothing("Jersey plunge bra"),
        clothing("Cotton shirt 2-14 years"),
        clothing("Bikini briefs"),
        clothing("Logo-print swimsuit")
      )

      val client = mock[SelfridgesClient[IO]]
      when(client.searchSale(any[SearchQuery])(any[SelfridgesItemMapper[ItemDetails.Clothing]]))
        .thenReturn(Stream.empty)
        .andThen(Stream.emits(unwantedItems))

      val result = StockService.selfridges[IO](client).flatMap {
        _.stockUpdates[ItemDetails.Clothing](config).interruptAfter(1200.millis).compile.toList
      }

      result.unsafeToFuture().map { updates =>
        updates must have size 1
        updates.head.item.itemDetails.name mustBe "T-shirt"
      }
    }

    "return items with discount greater than min" in {
      val items = List(
        clothing("T-shirt rrp", discount = None),
        clothing("T-shirt expensive", discount = Some(10)),
        clothing("T-shirt cheap", discount = Some(96))
      )

      val client = mock[SelfridgesClient[IO]]
      when(client.searchSale(any[SearchQuery])(any[SelfridgesItemMapper[ItemDetails.Clothing]]))
        .thenReturn(Stream.empty)
        .andThen(Stream.emits(items))

      val result = StockService.selfridges[IO](client).flatMap {
        _.stockUpdates[ItemDetails.Clothing](config).interruptAfter(1200.millis).compile.toList
      }

      result.unsafeToFuture().map { updates =>
        updates must have size 1
        updates.head.item.itemDetails.name mustBe "T-shirt cheap"
      }
    }
  }
}
