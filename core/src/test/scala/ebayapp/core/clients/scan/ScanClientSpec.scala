package ebayapp.core.clients.scan

import cats.effect.IO
import ebayapp.core.SttpClientSpec
import ebayapp.core.clients.SearchCriteria
import ebayapp.core.common.config.{GenericStoreConfig, StockMonitorConfig}
import sttp.client3.{Response, SttpBackend}
import ebayapp.core.requests._

import scala.concurrent.duration._


class ScanClientSpec extends SttpClientSpec {

  "A ScanClient" should {

    val config = GenericStoreConfig("http://scan.co.uk", StockMonitorConfig(10.second, Nil))

    val criteria = SearchCriteria("amd radeon rx 6900 xt pcie 40 graphics cards", Some("gpu-amd-gaming"))

    "return available graphic cards" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGoingTo("scan.co.uk/shop/gaming/gpu-amd-gaming/amd-radeon-rx-6900-xt-pcie-40-graphics-cards") =>
            Response.ok(json("scan/search-by-card.html"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = ScanClient.make[IO](config, testingBackend)

      client.flatMap(_.search(criteria).compile.toList).unsafeToFuture().map { items =>
        items must have size 2
      }
    }
  }
}
