package ebayapp.core.clients.argos

import cats.effect.IO
import ebayapp.core.SttpClientSpec
import ebayapp.core.common.config.{GenericStoreConfig, SearchCriteria, StockMonitorConfig}
import sttp.client3.{Response, SttpBackend}
import ebayapp.core.requests._

import scala.concurrent.duration._

class ArgosClientSpec extends SttpClientSpec {

  "An ArgosClient" should {

    val config   = GenericStoreConfig("http://argos.com", StockMonitorConfig(10.minutes, Nil))
    val criteria = SearchCriteria("PlayStation 5 Console")

    "return relevant deliverable or reservable items" in {
      val backend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.hasHost("argos.com") && r.hasPath("""finder-api/product;isSearch=true;queryParams={"page":"1","templateType":null};searchTerm=PlayStation 5 Console;searchType=null""") =>
            Response.ok(json("argos/search-success-page-1-response.json"))
          case r if r.isGet && r.hasHost("argos.com") && r.hasPath("""finder-api/product;isSearch=true;queryParams={"page":"2","templateType":null};searchTerm=PlayStation 5 Console;searchType=null""") =>
            Response.ok(json("argos/search-success-page-2-response.json"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = ArgosClient.make[IO](config, backend)

      val result = client.flatMap(_.search(criteria).compile.toList)

      result.unsafeToFuture().map { items =>
        items must have size 1
        items.head.itemDetails.fullName mustBe Some("Sony PlayStation 5 Digital Console")
      }
    }
  }
}
