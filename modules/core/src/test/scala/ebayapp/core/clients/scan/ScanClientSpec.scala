package ebayapp.core.clients.scan

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.search.SearchCriteria
import kirill5k.common.sttp.test.Sttp4WordSpec
import sttp.client4.testing.ResponseStub

class ScanClientSpec extends Sttp4WordSpec {

  "A ScanClient" should {

    val scanConfig = GenericRetailerConfig("http://scan.co.uk")
    val config     = MockRetailConfigProvider.make[IO](scanConfig = Some(scanConfig))

    val criteria = SearchCriteria("all", Some("gpu-nvidia-gaming"))

    "return available graphic cards" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGoingTo("scan.co.uk/shop/gaming/gpu-nvidia-gaming/all") =>
            ResponseStub.adjust(readJson("scan/search-by-card.html"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val result = for
        client <- ScanClient.make[IO](config, testingBackend)
        res    <- client.search(criteria).compile.toList
      yield res

      result.asserting { items =>
        items must have size 12
      }
    }
  }
}
