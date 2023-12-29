package ebayapp.core.clients.harveynichols

import cats.effect.IO
import ebayapp.core.MockConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria}
import ebayapp.kernel.SttpClientSpec
import sttp.client3
import sttp.client3.{Response, SttpBackend}

class HarveyNicholsClientSpec extends SttpClientSpec {

  "A HarveyNicholsClient" should {

    val harveyNicholsConfig = GenericRetailerConfig("http://harveynichols.com")
    val config              = MockConfigProvider.make[IO](harveyNicholsConfig = Some(harveyNicholsConfig))

    val criteria = SearchCriteria("kenzo")

    "return stream of clothing items that are on sale" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r
              if isSearchRequest(
                r,
                Map(
                  "context[sort_by]"     -> "low_to_high",
                  "query"                -> s"//search=${criteria.query}/categories=cp2_cp134/",
                  "context[page_number]" -> "1"
                )
              ) =>
            Response.ok(json("harvey-nichols/search-kenzo-page-1.json"))
          case r
              if isSearchRequest(
                r,
                Map(
                  "context[sort_by]"     -> "low_to_high",
                  "query"                -> s"//search=${criteria.query}/categories=cp2_cp134/",
                  "context[page_number]" -> "2"
                )
              ) =>
            Response.ok(json("harvey-nichols/search-kenzo-page-2.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      val client = HarveyNicholsClient.make[IO](config, testingBackend)

      client.flatMap(_.search(criteria).compile.toList).asserting { items =>
        items must have size 102

        val item = items.head
        item.itemDetails mustBe Clothing("Black cotton-blend shorts", "Kenzo", "M")
        item.buyPrice mustBe BuyPrice(1, BigDecimal(90), Some(50))
        item.listingDetails.url mustBe "https://www.harveynichols.com/brand/kenzo-kids/449414-black-cotton-blend-shorts/p4077689/"
        item.listingDetails.image mustBe Some("https://m.hng.io/catalog/product/8/5/857602_black_1.jpg?io=1&width=490&canvas=1:1")
      }
    }
  }

  def isSearchRequest(req: client3.Request[_, _], params: Map[String, String]): Boolean =
    req.isGet && req.hasHost("harveynichols.com") && req.hasPath("data/lister") && req.hasParams(params)
}
