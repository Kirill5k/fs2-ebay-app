package ebayapp.clients.argos

import cats.effect.IO
import ebayapp.SttpClientSpec
import ebayapp.common.config.{ArgosConfig, SearchQuery}
import sttp.client3.{Response, SttpBackend}
import ebayapp.requests._
import ebayapp.clients.argos.mappers._
import ebayapp.domain.ItemDetails

class ArgosClientSpec extends SttpClientSpec {

  "An ArgosClient" should {

    val config = ArgosConfig("http://argos.com")
    val query = SearchQuery("PlayStation 5 Console")

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

      val result = client.flatMap(_.findItem[ItemDetails.Generic](query).compile.toList)

      result.unsafeToFuture().map { items =>
        items must have size 1
        items.head.itemDetails.name mustBe "Sony PlayStation 5 Digital Console"
      }
    }
  }
}
