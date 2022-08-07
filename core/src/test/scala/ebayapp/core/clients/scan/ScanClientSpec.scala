package ebayapp.core.clients.scan

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.core.MockLogger
import ebayapp.core.clients.SearchCriteria
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import sttp.client3.{Response, SttpBackend}
import ebayapp.kernel.SttpClientSpec

class ScanClientSpec extends SttpClientSpec {

  given logger: Logger[IO] = MockLogger.make[IO]

  "A ScanClient" should {

    val config = GenericRetailerConfig("http://scan.co.uk")

    val criteria = SearchCriteria("all", Some("gpu-nvidia-gaming"))

    "return available graphic cards" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGoingTo("scan.co.uk/shop/gaming/gpu-nvidia-gaming/all") =>
            Response.ok(json("scan/search-by-card.html"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = ScanClient.make[IO](config, testingBackend)

      client.flatMap(_.search(criteria).compile.toList).asserting { items =>
        items must have size 12
      }
    }
  }
}
