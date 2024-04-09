package ebayapp.core.clients.cex

import cats.effect.IO
import cats.syntax.option.*
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.{CacheConfig, GenericRetailerConfig}
import ebayapp.core.domain.ResellableItemBuilder.{makeMobilePhone, makeVideoGame}
import ebayapp.kernel.errors.AppError
import ebayapp.core.domain.search.*
import ebayapp.core.domain.{ItemDetails, ResellableItem, ResellableItemBuilder}
import kirill5k.common.sttp.test.SttpWordSpec
import kirill5k.common.cats.Clock
import sttp.client3
import sttp.client3.{Response, SttpBackend}
import sttp.model.StatusCode

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

  "CexClient" should {

    "find items" in {
      val criteria = SearchCriteria("macbook pro 16,1")
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "macbook pro 16,1", "inStock" -> "1", "inStockOnline" -> "1")) =>
            Response.ok(readJson("cex/search-macbook-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.search(criteria).compile.toList)

      result
        .asserting(res =>
          res mustBe List(
            ResellableItem.generic(
              ItemDetails.Generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A"),
              ListingDetails(
                "https://uk.webuy.com/product-detail/?id=SLAPAPPMP16101SA",
                "Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A",
                Some("Laptops - Apple Mac"),
                None,
                None,
                None,
                "USED / A",
                res(0).listingDetails.datePosted,
                "CEX",
                Map()
              ),
              BuyPrice(2, 1950.0),
              Some(SellPrice(BigDecimal(1131.0), BigDecimal(1365.0))),
              criteria
            ),
            ResellableItem.generic(
              ItemDetails.Generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B"),
              ListingDetails(
                "https://uk.webuy.com/product-detail/?id=SLAPAPPMP16101SB",
                "Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B",
                Some("Laptops - Apple Mac"),
                None,
                None,
                None,
                "USED / B",
                res(1).listingDetails.datePosted,
                "CEX",
                Map()
              ),
              BuyPrice(1, 1800.0),
              Some(SellPrice(BigDecimal(1044.0), BigDecimal(1260.0))),
              criteria
            ),
            ResellableItem.generic(
              ItemDetails.Generic("Apple MacBook Pro 16,1/i9-9880H/16GB/1TB SSD/5500M 4GB/16\"/Space Grey/A"),
              ListingDetails(
                "https://uk.webuy.com/product-detail/?id=SLAPAPPMP16146SGA",
                "Apple MacBook Pro 16,1/i9-9880H/16GB/1TB SSD/5500M 4GB/16\"/Space Grey/A",
                Some("Laptops - Apple Mac"),
                None,
                None,
                None,
                "USED / A",
                res(2).listingDetails.datePosted,
                "CEX",
                Map()
              ),
              BuyPrice(1, 2200.0),
              Some(SellPrice(BigDecimal(1276.0), BigDecimal(1540.0))),
              criteria
            )
          )
        )
    }

    "find minimal sell price for phones" in {
      val item = makeMobilePhone("Apple", "iPhone 6S", "Grey")
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "Apple iPhone 6S 16GB Grey Unlocked")) =>
            Response.ok(readJson("cex/search-iphone-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(None)(item))

      result.asserting { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(108), BigDecimal(153)))
      }
    }

    "find minimal sell price for games" in {
      val item = makeVideoGame("UFC 3 2020", sellPrice = None, platform = Some("PLAYSTATION4"))
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "UFC 3 2020 PLAYSTATION4", "categoryIds" -> "[1003,1141]")) =>
            Response.ok(readJson("cex/search-game-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(Some("games-ps4-ps5"))(item))

      result.asserting { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(0.8), BigDecimal(1.4)))
      }
    }

    "ignore items that cannot be sold anymore" in {
      val item = makeVideoGame("Need for speed", sellPrice = None, platform = Some("PLAYSTATION4"))
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "Need for speed PLAYSTATION4", "categoryIds" -> "[782]")) =>
            Response.ok(readJson("cex/search-game-cannotbuy-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(Some("games-xbox-360"))(item))

      result.asserting { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(6.0), BigDecimal(9.0)))
      }
    }

    "return resell price from cache" in {
      val item = makeVideoGame("super mario3", sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response.ok(readJson("cex/search-iphone-success-response.json")),
          Response(readJson("cex/search-error-response.json"), StatusCode.InternalServerError)
        )

      val result = for
        cexClient <- CexClient.standard[IO](config, testingBackend)
        _         <- cexClient.withUpdatedSellPrice(None)(item)
        rp        <- cexClient.withUpdatedSellPrice(None)(item)
      yield rp

      result.asserting { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(108), BigDecimal(153)))
      }
    }

    "not do anything when not enough details to query for price" in {
      val item = makeVideoGame("super mario 3", platform = None, sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial { case _ =>
          throw new RuntimeException()
        }

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(None)(item))

      result.asserting { updatedItem =>
        updatedItem.sellPrice mustBe None
      }
    }

    "perform another request after cache expired" in {
      val item = makeVideoGame("super mario 3", sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response.ok(readJson("cex/search-iphone-success-response.json")),
          Response.ok(readJson("cex/search-noresults-response.json"))
        )

      val result = for
        cexClient <- CexClient.standard[IO](config, testingBackend)
        _         <- cexClient.withUpdatedSellPrice(None)(item)
        _         <- IO.sleep(4.seconds)
        rp        <- cexClient.withUpdatedSellPrice(None)(item)
      yield rp

      result.asserting { res =>
        res.sellPrice mustBe None
      }
    }

    "retry without category when there are no results" in {
      val item = makeVideoGame("super mario 3", sellPrice = None, platform = Some("SWITCH"))
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "super mario 3 SWITCH", "categoryIds" -> "[1064]")) =>
            Response.ok(readJson("cex/search-noresults-response.json"))
          case r if isQueryRequest(r, Map("q" -> "super mario 3 SWITCH")) =>
            Response.ok(readJson("cex/search-game-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(Some("games-switch"))(item))

      result.asserting { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(0.8), BigDecimal(1.4)))
      }
    }

    "return none when no results" in {
      val item = makeVideoGame("super mario 3", sellPrice = None, platform = Some("SWITCH"))
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "super mario 3 SWITCH")) =>
            Response.ok(readJson("cex/search-noresults-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(Some("games-switch"))(item))

      result.asserting { updatedItem =>
        updatedItem.sellPrice mustBe None
      }
    }

    "return internal error when failed to parse json" in {
      val item = makeVideoGame("super mario 3", sellPrice = None, platform = Some("SWITCH"))
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "super mario 3 SWITCH", "categoryIds" -> "[1000,1146,1147]")) =>
            Response.ok(readJson("cex/search-unexpected-response.json"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(Some("games-xbox-one-series-x"))(item))

      result.attempt.asserting { price =>
        price mustBe Left(
          AppError.Json(
            "cex-search/json-error: DecodingFailure at .response.data.boxes: Got value '\"foo-bar\"' with wrong type, expecting array"
          )
        )
      }
    }

    "retry when 429 returned" in {
      val item = makeVideoGame("super mario 3", sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response(readJson("cex/search-error-response.json"), StatusCode.TooManyRequests),
          Response(readJson("cex/search-error-response.json"), StatusCode.TooManyRequests),
          Response.ok(readJson("cex/search-iphone-success-response.json"))
        )

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(None)(item))

      result.asserting { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(108), BigDecimal(153)))
      }
    }

    "retry on other http errors" in {
      val item = makeVideoGame("super mario 3", sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response(readJson("cex/search-error-response.json"), StatusCode.BadRequest),
          Response(readJson("cex/search-error-response.json"), StatusCode.BadRequest),
          Response.ok(readJson("cex/search-iphone-success-response.json"))
        )

      val cexClient = CexClient.standard[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(None)(item))

      result.asserting { item =>
        item.sellPrice mustBe Some(SellPrice(BigDecimal(108), BigDecimal(153)))
      }
    }

    def isQueryRequest(req: client3.Request[?, ?], params: Map[String, String]): Boolean =
      req.isGet && req.isGoingTo("cex.com/v3/boxes") && req.hasParams(params)
  }

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
