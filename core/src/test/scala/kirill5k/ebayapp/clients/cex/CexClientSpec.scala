package kirill5k.ebayapp.clients.cex

import cats.effect.IO
import cats.effect.implicits._
import kirill5k.ebayapp.SttpClientSpec
import kirill5k.ebayapp.common.config.CexConfig
import kirill5k.ebayapp.common.errors.ApplicationError.{HttpError, JsonParsingError}
import kirill5k.ebayapp.resellables.{ItemDetails, ListingDetails, Price, ResellPrice, ResellableItem, SearchQuery}
import sttp.client
import sttp.client.Response
import sttp.client.asynchttpclient.WebSocketHandler
import sttp.client.asynchttpclient.cats.AsyncHttpClientCatsBackend
import sttp.client.testing.SttpBackendStub
import sttp.model.{Method, StatusCode}

class CexClientSpec extends SttpClientSpec {

  "CexClient" should {

    val config = CexConfig("http://cex.com")

    "get current stock" in {
      val query = SearchQuery("macbook pro 16,1")
      val testingBackend: SttpBackendStub[IO, Nothing, WebSocketHandler] = AsyncHttpClientCatsBackend
        .stub[IO]
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value, "inStock" -> "1", "inStockOnline" -> "1")) =>
            Response.ok(json("cex/search-macbook-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.getCurrentStock[ItemDetails.Generic](query))

      result
        .unsafeToFuture()
        .map(
          res =>
            res must be(
              List(
                ResellableItem(
                  ItemDetails.Generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A"),
                  ListingDetails(
                    "https://uk.webuy.com/product-detail/?id=SLAPAPPMP16101SA",
                    "Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/A",
                    Some("Laptops - Apple Mac"),
                    None,
                    None,
                    "USED / A",
                    res(0).listingDetails.datePosted,
                    "CEX",
                    Map()
                  ),
                  Price(2, 1950.0),
                  Some(ResellPrice(BigDecimal(1131.0), BigDecimal(1365.0)))
                ),
                ResellableItem(
                  ItemDetails.Generic("Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B"),
                  ListingDetails(
                    "https://uk.webuy.com/product-detail/?id=SLAPAPPMP16101SB",
                    "Apple MacBook Pro 16,1/i7-9750H/16GB/512GB SSD/5300M 4GB/16\"/Silver/B",
                    Some("Laptops - Apple Mac"),
                    None,
                    None,
                    "USED / B",
                    res(1).listingDetails.datePosted,
                    "CEX",
                    Map()
                  ),
                  Price(1, 1800.0),
                  Some(ResellPrice(BigDecimal(1044.0), BigDecimal(1260.0)))
                ),
                ResellableItem(
                  ItemDetails.Generic("Apple MacBook Pro 16,1/i9-9880H/16GB/1TB SSD/5500M 4GB/16\"/Space Grey/A"),
                  ListingDetails(
                    "https://uk.webuy.com/product-detail/?id=SLAPAPPMP16146SGA",
                    "Apple MacBook Pro 16,1/i9-9880H/16GB/1TB SSD/5500M 4GB/16\"/Space Grey/A",
                    Some("Laptops - Apple Mac"),
                    None,
                    None,
                    "USED / A",
                    res(2).listingDetails.datePosted,
                    "CEX",
                    Map()
                  ),
                  Price(1, 2200.0),
                  Some(ResellPrice(BigDecimal(1276.0), BigDecimal(1540.0)))
                )
              )
            )
        )
    }

    "find minimal resell price" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackendStub[IO, Nothing, WebSocketHandler] = AsyncHttpClientCatsBackend
        .stub[IO]
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value)) =>
            Response.ok(json("cex/search-iphone-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findResellPrice(query))

      result.unsafeToFuture().map { price =>
        price must be(Some(ResellPrice(BigDecimal.valueOf(108), BigDecimal.valueOf(153))))
      }
    }

    "return resell price from cache" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackendStub[IO, Nothing, WebSocketHandler] = AsyncHttpClientCatsBackend
        .stub[IO]
        .whenAnyRequest
        .thenRespondCyclicResponses(
          Response.ok(json("cex/search-iphone-success-response.json")),
          Response(json("cex/search-error-response.json"), StatusCode.InternalServerError)
        )

      val result = for {
        cexClient <- CexClient.make[IO](config, testingBackend)
        _         <- cexClient.findResellPrice(query)
        rp        <- cexClient.findResellPrice(query)
      } yield rp

      result.unsafeToFuture().map { price =>
        val expectedPrice = Some(ResellPrice(BigDecimal.valueOf(108), BigDecimal.valueOf(153)))
        price must be(expectedPrice)
      }
    }

    "return none when no results" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackendStub[IO, Nothing, WebSocketHandler] = AsyncHttpClientCatsBackend
        .stub[IO]
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value)) =>
            Response.ok(json("cex/search-noresults-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findResellPrice(query))

      result.unsafeToFuture().map { price =>
        price must be(None)
      }
    }

    "return internal error when failed to parse json" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackendStub[IO, Nothing, WebSocketHandler] = AsyncHttpClientCatsBackend
        .stub[IO]
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value)) =>
            Response.ok(json("cex/search-unexpected-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findResellPrice(query))

      result.attempt.unsafeToFuture().map { price =>
        price must be(
          Left(JsonParsingError("error parsing json: DecodingFailure(C[A], List(DownField(boxes), DownField(data), DownField(response)))"))
        )
      }
    }

    "return http error when not success" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackendStub[IO, Nothing, WebSocketHandler] = AsyncHttpClientCatsBackend
        .stub[IO]
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> query.value)) =>
            Response(json("cex/search-error-response.json"), StatusCode.BadRequest)
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findResellPrice(query))

      result.attempt.unsafeToFuture().map { price =>
        price must be(Left(HttpError(400, "error sending request to cex: 400")))
      }
    }

    "retry when 429 returned" in {
      val query = SearchQuery("super mario 3 XBOX ONE")
      val testingBackend: SttpBackendStub[IO, Nothing, WebSocketHandler] = AsyncHttpClientCatsBackend
        .stub[IO]
        .whenAnyRequest
        .thenRespondCyclicResponses(
          Response(json("cex/search-error-response.json"), StatusCode.TooManyRequests),
          Response(json("cex/search-error-response.json"), StatusCode.TooManyRequests),
          Response.ok(json("cex/search-iphone-success-response.json"))
        )

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findResellPrice(query))

      result.unsafeToFuture().map { price =>
        price must be(Some(ResellPrice(BigDecimal.valueOf(108), BigDecimal.valueOf(153))))
      }
    }

    def isQueryRequest(req: client.Request[_, _], params: Map[String, String]): Boolean =
      isGoingTo(req, Method.GET, "cex.com", List("v3", "boxes"), params)
  }
}
