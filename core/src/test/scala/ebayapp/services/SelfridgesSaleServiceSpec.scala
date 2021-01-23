package ebayapp.services

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.clients.selfridges.SelfridgesClient
import ebayapp.common.config.{SearchQuery, StockMonitorConfig, StockMonitorRequest}
import ebayapp.domain.ResellableItemBuilder.clothing
import fs2.Stream

import scala.concurrent.duration._

class SelfridgesSaleServiceSpec extends CatsSpec {

  val query = SearchQuery("foo")
  val config = StockMonitorConfig(1.second, List(StockMonitorRequest(SearchQuery("foo"), true, true)))

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
      when(client.search(any[SearchQuery]))
        .thenReturn(Stream.empty)
        .andThen(Stream.emits(unwantedItems))

      val service = new LiveSelfridgesSaleService[IO](client)
      val result = service.newSaleItems(config).interruptAfter(2200.millis).compile.toList

      result.unsafeToFuture().map { updates =>
        updates must have size 1
        updates.head.item.itemDetails.name mustBe "T-shirt"
      }
    }
  }
}
