package ebayapp.core.clients.nvidia

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.core.{MockConfigProvider, MockLogger}
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import sttp.client3.*
import ebayapp.kernel.SttpClientSpec

class NvidiaClientSpec extends SttpClientSpec {

  given logger: Logger[IO] = MockLogger.make[IO]

  "A NvidiaClient" should {

    val nvidiaConfig = GenericRetailerConfig("http://nvidia.com")
    val config       = MockConfigProvider.make[IO](nvidiaConfig = Some(nvidiaConfig))

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
        res must have size 103
      }
    }

    "return items from featured as well" in {
      val requestParams = Map("page" -> "1", "limit" -> "512", "locale" -> "en-gb", "search" -> "geforce", "category" -> "GPU")
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("nvidia.com/edge/product/search") && r.hasParams(requestParams) =>
            Response.ok(json("nvidia/search-with-retailers-response.json"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = NvidiaClient.make[IO](config, testingBackend)

      val result = client.flatMap(_.search(criteria).compile.toList)

      result.asserting { res =>
        res.flatMap(_.itemDetails.fullName) mustBe List(
          "NVIDIA RTX 3080 Ti (19/19)",
          "NVIDIA RTX 3090 Ti (19/19)",
          "NVIDIA RTX 3080 (19/19)",
          "NVIDIA RTX 3090 (19/19)",
          "NVIDIA RTX 3070 (19/19)",
          "NVIDIA RTX 3060 Ti (19/19)",
          "NVIDIA RTX 3070 Ti (19/19)",
          "ACER RTX 3050 Ti (183/139)",
          "ACER RTX 3050 Ti (1/9)",
          "ACER RTX 3050 Ti (23/23)",
          "LENOVO RTX 3060 (183/139)",
          "MSI RTX 3070 (183/139)"
        )
      }
    }
  }
}
