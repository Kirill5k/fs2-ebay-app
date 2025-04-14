package ebayapp.core.clients.argos

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.domain.search.SearchCriteria
import ebayapp.core.common.config.GenericRetailerConfig
import kirill5k.common.sttp.test.Sttp4WordSpec
import sttp.client4.testing.ResponseStub

class ArgosClientSpec extends Sttp4WordSpec {

  "An ArgosClient" should {

    val argosConfig = GenericRetailerConfig("http://argos.com")
    val config      = MockRetailConfigProvider.make[IO](argosConfig = Some(argosConfig))
    val criteria    = SearchCriteria("PlayStation 5 Console")

    "return relevant deliverable or reservable items" in {
      val backend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r
              if r.isGet && r.hasHost("argos.com") && r.hasPath(
                """finder-api/product;isSearch=true;queryParams={"page":"1","templateType":null};searchTerm=PlayStation 5 Console;searchType=null"""
              ) =>
            ResponseStub.adjust(readJson("argos/search-success-page-1-response.json"))
          case r
              if r.isGet && r.hasHost("argos.com") && r.hasPath(
                """finder-api/product;isSearch=true;queryParams={"page":"2","templateType":null};searchTerm=PlayStation 5 Console;searchType=null"""
              ) =>
            ResponseStub.adjust(readJson("argos/search-success-page-2-response.json"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = ArgosClient.make[IO](config, backend)

      val result = client.flatMap(_.search(criteria).compile.toList)

      result.asserting { items =>
        items must have size 1
        items.head.itemDetails.fullName mustBe Some("Sony PlayStation 5 Digital Console")
      }
    }
  }
}
