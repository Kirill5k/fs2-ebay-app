package ebayapp.core.clients.frasers

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.clients.CurlImpersonateClient
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.search.SearchCriteria
import kirill5k.common.cats.test.IOWordSpec
import kirill5k.common.test.FileReader
import sttp.model.StatusCode

class FrasersClientSpec extends IOWordSpec {

  "FrasersClient for flannels" should {
    val flannelsConfig = GenericRetailerConfig("http://f.com", Map.empty)
    val config         = MockRetailConfigProvider.make[IO](flannelsConfig = Some(flannelsConfig))
    val sc             = SearchCriteria("stone island", Some("mens"))

    "return stream of items based on provided search criteria" in {
      val client = mock[CurlImpersonateClient[IO]]
      when(
        client.get(
          eqTo("http://f.com/stone-island/mens?sort=DISCOUNT_PERCENTAGE&sortDirection=DESC&dcp=1"),
          any[Map[String, String]],
          any
        )
      ).thenReturnIO((StatusCode.Ok, FileReader.fromResources("frasers/brand-page1.html")))
      when(
        client.get(
          eqTo("http://f.com/stone-island/mens?sort=DISCOUNT_PERCENTAGE&sortDirection=DESC&dcp=2"),
          any[Map[String, String]],
          any
        )
      ).thenReturnIO((StatusCode.Ok, FileReader.fromResources("frasers/brand-page2.html")))
      when(
        client.get(
          eqTo("http://f.com/stone-island/mens?sort=DISCOUNT_PERCENTAGE&sortDirection=DESC&dcp=3"),
          any[Map[String, String]],
          any
        )
      ).thenReturnIO((StatusCode.Ok, FileReader.fromResources("frasers/brand-page3.html")))

      FrasersClient
        .flannels[IO](config, client)
        .flatMap(_.search(sc).compile.toList)
        .asserting { items =>
          items must have size 332
          items.map(_.listingDetails.seller).toSet mustBe Set("Flannels")
        }
    }

    "return stream of items without category" in {
      val client   = mock[CurlImpersonateClient[IO]]
      val criteria = SearchCriteria("stone island", None)
      when(
        client.get(
          eqTo("http://f.com/stone-island?sort=DISCOUNT_PERCENTAGE&sortDirection=DESC&dcp=1"),
          any[Map[String, String]],
          any
        )
      ).thenReturnIO((StatusCode.Ok, FileReader.fromResources("frasers/brand-page3.html")))

      FrasersClient
        .flannels[IO](config, client)
        .flatMap(_.search(criteria).compile.toList)
        .asserting { items =>
          items must have size 153
        }
    }
  }
}
