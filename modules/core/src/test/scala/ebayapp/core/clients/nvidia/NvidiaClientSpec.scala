package ebayapp.core.clients.nvidia

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.common.config.GenericRetailerConfig
import kirill5k.common.sttp.test.Sttp4WordSpec
import sttp.client4.testing.ResponseStub

class NvidiaClientSpec extends Sttp4WordSpec {

  "A NvidiaClient" should {

    val nvidiaConfig = GenericRetailerConfig("http://nvidia.com")
    val config       = MockRetailConfigProvider.make[IO](nvidiaConfig = Some(nvidiaConfig))

    val criteria = SearchCriteria("geforce", Some("GPU"))

    val requestParams = Map("page" -> "1", "limit" -> "512", "locale" -> "en-gb", "search" -> "geforce", "category" -> "GPU")

    "return items that are in stock" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("nvidia.com/edge/product/search") && r.hasParams(requestParams) =>
            ResponseStub.adjust(readJson("nvidia/search-success-response.json"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val result = for
        client <- NvidiaClient.make[IO](config, testingBackend)
        res    <- client.search(criteria).compile.toList
      yield res

      result.asserting { res =>
        res must have size 103
      }
    }

    "return items from featured as well" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("nvidia.com/edge/product/search") && r.hasParams(requestParams) =>
            ResponseStub.adjust(readJson("nvidia/search-with-retailers-response.json"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val result = for
        client <- NvidiaClient.make[IO](config, testingBackend)
        res    <- client.search(criteria).compile.toList
      yield res

      result.asserting { res =>
        res.flatMap(_.itemDetails.fullName) mustBe List(
          "NVIDIA RTX 3080 Ti (19/19)",
          "NVIDIA RTX 3090 Ti (19/19)",
          "NVIDIA RTX 3080 (19/19)",
          "NVIDIA RTX 3090 (19/19)",
          "NVIDIA RTX 3070 (19/19)",
          "NVIDIA RTX 3060 Ti (19/19)",
          "NVIDIA RTX 3070 Ti (19/19)",
          "PALIT GTX 1650 (12/10)",
          "PALIT GTX 1650 (1/9)",
          "PALIT GTX 1650 (16/18)",
          "MSI GTX 1650 (12/10)",
          "MSI GTX 1650 (13/14)",
          "MSI GTX 1650 (23/23)",
          "GIGABYTE GTX 1650 (12/10)",
          "GIGABYTE GTX 1650 (1/9)"
        )
      }
    }

    "handle json serialization errors" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("nvidia.com/edge/product/search") && r.hasParams(requestParams) =>
            ResponseStub.adjust(readJson("nvidia/search-with-invalid-json-response.json"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val result = for
        client <- NvidiaClient.make[IO](config, testingBackend)
        res    <- client.search(criteria).compile.toList
      yield res

      result.asserting { res =>
        res must have size 0
      }
    }
  }
}
