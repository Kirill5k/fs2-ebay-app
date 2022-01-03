package ebayapp.core.clients.harveynichols

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.core.MockLogger
import ebayapp.core.clients.SearchCriteria
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.kernel.SttpClientSpec
import sttp.client3
import sttp.client3.{Response, SttpBackend}
import sttp.model.Method

class HarveyNicholsClientSpec extends SttpClientSpec {

  given logger: Logger[IO] = MockLogger.make[IO]

  "A HarveyNicholsClient" should {

    val config   = GenericRetailerConfig("http://harveynichols.com")
    val criteria = SearchCriteria("kenzo")

    "return stream of clothing items that are on sale" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isSearchRequest(r, Map("context[sort_by]" -> "low_to_high", "meta[searchTerm]" -> criteria.query, "context[page_number]" -> "1")) =>
            Response.ok(json("harvey-nichols/search-kenzo-page-1.json"))
          case r if isSearchRequest(r, Map("context[sort_by]" -> "low_to_high", "meta[searchTerm]" -> criteria.query, "context[page_number]" -> "2")) =>
            Response.ok(json("harvey-nichols/search-kenzo-page-2.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      val client = HarveyNicholsClient.make[IO](config, testingBackend)

      client.flatMap(_.search(criteria).compile.toList).unsafeToFuture().map { items =>
        items must have size 102
      }
    }
  }

  def isSearchRequest(req: client3.Request[_, _], params: Map[String, String]): Boolean =
    req.isGet && req.hasHost("harveynichols.com") && req.hasPath("data/lister") && req.hasParams(params)
}
