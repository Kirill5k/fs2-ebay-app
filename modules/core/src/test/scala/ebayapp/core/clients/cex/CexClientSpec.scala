package ebayapp.core.clients.cex

import cats.effect.IO
import cats.syntax.option.*
import ebayapp.core.MockLogger.given
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.common.config.{CacheConfig, GenericRetailerConfig}
import ebayapp.core.domain.search.*
import kirill5k.common.cats.Clock
import kirill5k.common.sttp.test.SttpWordSpec
import sttp.client3
import sttp.client3.{Response, SttpBackend}

import java.time.Instant
import scala.collection.immutable.Map
import scala.concurrent.duration.*

class CexClientSpec extends SttpWordSpec {

  given Clock[IO] = Clock.mock(Instant.parse("2020-01-01T00:00:00Z"))

  val cexConfig = GenericRetailerConfig(
    "http://cex.com",
    cache = Some(CacheConfig(3.seconds, 1.second)),
    queryParameters = Map(
      "x-algolia-agent" -> "Algolia for JavaScript (4.13.1); Browser (lite); instantsearch.js (4.41.1); Vue (2.6.14); Vue InstantSearch (4.3.3); JS Helper (3.8.2)",
      "x-algolia-api-key"        -> "api-key",
      "x-algolia-application-id" -> "app-id"
    ).some
  )

  val config = MockRetailConfigProvider.make[IO](cexConfig = Some(cexConfig))
  
  "CexGraphqlClient" should {
    "find items" in {
      val reqBody =
        """{"requests":[
          |{
          |"indexName":"prod_cex_uk",
          |"params":"query=gta 5 xbox&userToken=ecf31216f1ec463fac30a91a1f0a0dc3&facetFilters=%5B%5B%22availability%3AIn%20Stock%20Online%22%2C%22availability%3AIn%20Stock%20In%20Store%22%5D%5D"
          |}
          |]}""".stripMargin.replaceAll("\n", "")

      val criteria = SearchCriteria("gta 5 xbox")

      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r
              if r.isPost && r.isGoingTo("cex.com/1/indexes/*/queries") && r
                .hasBody(reqBody) && r.hasParams(cexConfig.queryParameters.get) =>
            Response.ok(readJson("cex/search-graphql-success-response.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      val cexClient = CexClient.graphql[IO](config, testingBackend)

      val result = cexClient.flatMap(_.search(criteria).compile.toList)

      result.asserting { items =>
        items.flatMap(_.itemDetails.fullName) mustBe List(
          "Grand Theft Auto V (5)",
          "Grand Theft Auto V (5) *2 Disc*",
          "Grand Theft Auto V (2 Disc)",
          "Grand Theft Auto V (5) Collector's Ed."
        )
        items.map(_.buyPrice) mustBe List(
          BuyPrice(2425, 15, None),
          BuyPrice(2045, 4, None),
          BuyPrice(170, 20, None),
          BuyPrice(3, 58, None)
        )
      }
    }
  }
}
