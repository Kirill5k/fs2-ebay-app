package ebayapp.core.clients.argos

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.clients.CurlImpersonateClient
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.search.SearchCriteria
import kirill5k.common.cats.test.IOWordSpec
import kirill5k.common.test.FileReader
import sttp.client4.UriContext
import sttp.model.StatusCode

class ArgosClientSpec extends IOWordSpec {

  "An ArgosClient" should {

    val argosConfig = GenericRetailerConfig("http://argos.com")
    val config      = MockRetailConfigProvider.make[IO](argosConfig = Some(argosConfig))
    val criteria    = SearchCriteria("PlayStation 5 Console")

    "return relevant deliverable or reservable items" in {
      val client = mock[CurlImpersonateClient[IO]]

      val url1 =
        uri"http://argos.com/finder-api/product;isSearch=true;queryParams={%22page%22:%221%22,%22templateType%22:null};searchTerm=${criteria.query};searchType=null?returnMeta=true".toString
      val url2 =
        uri"http://argos.com/finder-api/product;isSearch=true;queryParams={%22page%22:%222%22,%22templateType%22:null};searchTerm=${criteria.query};searchType=null?returnMeta=true".toString

      when(
        client.get(
          eqTo(url1),
          any[Map[String, String]],
          any
        )
      ).thenReturnIO((StatusCode.Ok, FileReader.fromResources("argos/search-success-page-1-response.json")))

      when(
        client.get(
          eqTo(url2),
          any[Map[String, String]],
          any
        )
      ).thenReturnIO((StatusCode.Ok, FileReader.fromResources("argos/search-success-page-2-response.json")))

      ArgosClient
        .make[IO](config, client)
        .flatMap(_.search(criteria).compile.toList)
        .asserting { items =>
          items must have size 1
          items.head.itemDetails.fullName mustBe Some("Sony PlayStation 5 Digital Console")
        }
    }
  }
}
