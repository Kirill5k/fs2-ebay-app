package ebayapp.core.clients.nvidia

import cats.effect.IO
import ebayapp.core.SttpClientSpec
import ebayapp.core.common.config.{GenericStoreConfig, SearchCriteria, StockMonitorConfig}
import sttp.client3._
import ebayapp.core.requests._

import scala.concurrent.duration._

class NvidiaClientSpec extends SttpClientSpec {

  "A NvidiaClient" should {

    val config = GenericStoreConfig("http://nvidia.com", StockMonitorConfig(10.second, Nil))

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

      result.unsafeToFuture().map { res =>
        res must have size 99
      }
    }
  }
}
