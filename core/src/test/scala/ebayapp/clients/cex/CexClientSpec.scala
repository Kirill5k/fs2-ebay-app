package ebayapp.clients.cex

import cats.effect.IO
import ebayapp.SttpClientSpec
import ebayapp.common.config.{CexConfig, CexPriceFindConfig}
import ebayapp.common.errors.AppError
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.domain.search._
import sttp.client
import sttp.client.{NothingT, Response, SttpBackend}
import sttp.model.{Method, StatusCode}

import scala.concurrent.duration._

class CexClientSpec extends SttpClientSpec {

  "CexClient" should {

    val config = CexConfig("http://cex.com", CexPriceFindConfig(3.seconds, 1.second))

    "find items" in {
      val query = SearchQuery("macbook pro 16,1")
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value, "inStock" -> "1", "inStockOnline" -> "1")) =>
            Response.ok(json("cex/search-macbook-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findItem[ItemDetails.Generic](query))

      result
        .unsafeToFuture()
        .map(res => res must be(List(
          ResellableItem(
            ItemDetails.Generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A"),
            ListingDetails("https://uk.webuy.com/product-detail/?id=SLAPAPPMP16101SA", "Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A", Some("Laptops - Apple Mac"), None, None, "USED / A", res(0).listingDetails.datePosted, "CEX", Map()),
            BuyPrice(2, 1950.0),
            Some(SellPrice(BigDecimal(1131.0), BigDecimal(1365.0)))
          ),
          ResellableItem(
            ItemDetails.Generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B"),
            ListingDetails("https://uk.webuy.com/product-detail/?id=SLAPAPPMP16101SB", "Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B", Some("Laptops - Apple Mac"), None, None, "USED / B", res(1).listingDetails.datePosted, "CEX", Map()),
            BuyPrice(1, 1800.0),
            Some(SellPrice(BigDecimal(1044.0), BigDecimal(1260.0)))
          ),
          ResellableItem(
            ItemDetails.Generic("Apple MacBook Pro 16,1/i9-9880H/16GB/1TB SSD/5500M 4GB/16\"/Space Grey/A"),
            ListingDetails("https://uk.webuy.com/product-detail/?id=SLAPAPPMP16146SGA", "Apple MacBook Pro 16,1/i9-9880H/16GB/1TB SSD/5500M 4GB/16\"/Space Grey/A", Some("Laptops - Apple Mac"), None, None, "USED / A", res(2).listingDetails.datePosted, "CEX", Map()),
            BuyPrice(1, 2200.0),
            Some(SellPrice(BigDecimal(1276.0), BigDecimal(1540.0)))
          )
        )))
    }

    "find minimal sell price" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value)) =>
            Response.ok(json("cex/search-iphone-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findSellPrice(query))

      result.unsafeToFuture().map { price =>
        price must be(Some(SellPrice(BigDecimal(108), BigDecimal(153))))
      }
    }

    "return resell price from cache" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenAnyRequest
        .thenRespondCyclicResponses(
          Response.ok(json("cex/search-iphone-success-response.json")),
          Response(json("cex/search-error-response.json"), StatusCode.InternalServerError)
        )

      val result = for {
        cexClient <- CexClient.make[IO](config, testingBackend)
        _         <- cexClient.findSellPrice(query)
        rp        <- cexClient.findSellPrice(query)
      } yield rp

      result.unsafeToFuture().map { price =>
        val expectedPrice = Some(SellPrice(BigDecimal(108), BigDecimal(153)))
        price must be(expectedPrice)
      }
    }

    "perform another request after cache expired" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenAnyRequest
        .thenRespondCyclicResponses(
          Response.ok(json("cex/search-iphone-success-response.json")),
          Response(json("cex/search-error-response.json"), StatusCode.BadRequest)
        )

      val result = for {
        cexClient <- CexClient.make[IO](config, testingBackend)
        _         <- cexClient.findSellPrice(query)
        _         <- timer.sleep(4.seconds)
        rp        <- cexClient.findSellPrice(query)
      } yield rp

      result.attempt.unsafeToFuture().map { res =>
        res must be(Left(AppError.Http(400, "error sending request to cex: 400")))
      }
    }

    "return none when no results" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value)) =>
            Response.ok(json("cex/search-noresults-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findSellPrice(query))

      result.unsafeToFuture().map { price =>
        price must be(None)
      }
    }

    "return internal error when failed to parse json" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value)) =>
            Response.ok(json("cex/search-unexpected-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findSellPrice(query))

      result.attempt.unsafeToFuture().map { price =>
        price must be(
          Left(AppError.Json("error parsing json: DecodingFailure(C[A], List(DownField(boxes), DownField(data), DownField(response)))"))
        )
      }
    }

    "return http error when not success" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value)) =>
            Response(json("cex/search-error-response.json"), StatusCode.BadRequest)
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findSellPrice(query))

      result.attempt.unsafeToFuture().map { price =>
        price must be(Left(AppError.Http(400, "error sending request to cex: 400")))
      }
    }

    "retry when 429 returned" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenAnyRequest
        .thenRespondCyclicResponses(
          Response(json("cex/search-error-response.json"), StatusCode.TooManyRequests),
          Response(json("cex/search-error-response.json"), StatusCode.TooManyRequests),
          Response.ok(json("cex/search-iphone-success-response.json"))
        )

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findSellPrice(query))

      result.unsafeToFuture().map { price =>
        price must be(Some(SellPrice(BigDecimal(108), BigDecimal(153))))
      }
    }

    def isQueryRequest(req: client.Request[_, _], params: Map[String, String]): Boolean =
      isGoingTo(req, Method.GET, "cex.com", List("v3", "boxes"), params)
  }
}
