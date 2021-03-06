package ebayapp.core.clients.nvidia

import cats.effect.IO
import ebayapp.core.SttpClientSpec
import ebayapp.core.common.config.{NvidiaConfig, SearchCategory, SearchQuery, StockMonitorConfig}
import ebayapp.core.clients.nvidia.mappers._
import ebayapp.core.domain.ItemDetails
import sttp.client3.{Response, SttpBackend}
import ebayapp.core.requests._

import scala.concurrent.duration._

class NvidiaClientSpec extends SttpClientSpec {

  "A NvidiaClient" should {

    val config = NvidiaConfig(
      "http://nvidia.com",
      StockMonitorConfig(10.second, Nil)
    )

    val query    = SearchQuery("geforce")
    val category = SearchCategory("GPU")

    "return items that are in stock" in {
      val requestParams = Map("page" -> "1", "limit" -> "512", "locale" -> "en-gb", "search" -> "geforce", "category" -> "GPU")
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("nvidia.com/edge/product/search") && r.hasParams(requestParams) =>
            Response.ok(json("nvidia/search-success-response.json"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = NvidiaClient.make[IO](config, testingBackend)

      val result = client.flatMap(_.search[ItemDetails.Generic](query, Some(category)).compile.toList)

      result.unsafeToFuture().map { res =>
        res must have size 99
      }
    }
  }
}
