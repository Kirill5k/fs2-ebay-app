package ebayapp.core.clients.nvidia

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.core.MockLogger
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import sttp.client3.*
import ebayapp.kernel.SttpClientSpec

class NvidiaClientSpec extends SttpClientSpec {

  given logger: Logger[IO] = MockLogger.make[IO]

  "A NvidiaClient" should {

    val config = GenericRetailerConfig("http://nvidia.com")

    val criteria = SearchCriteria("geforce", Some("GPU"))

    "return items that are in stock" in {
      val requestParams = Map("page" -> "1", "limit" -> "512", "locale" -> "en-gb", "search" -> "geforce", "category" -> "GPU")
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("nvidia.com/edge/product/search") && r.hasParams(requestParams) =>
            Response.ok(json("nvidia/search-success-response.json"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = NvidiaClient.make[IO](config, testingBackend)

      val result = client.flatMap(_.search(criteria).compile.toList)

      result.asserting { res =>
        res must have size 99
      }
    }
  }
}
