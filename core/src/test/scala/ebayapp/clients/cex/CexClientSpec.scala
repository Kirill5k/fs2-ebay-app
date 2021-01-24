package ebayapp.clients.cex

import cats.effect.IO
import ebayapp.SttpClientSpec
import ebayapp.common.config.{CexConfig, CexPriceFindConfig, StockMonitorConfig, SearchQuery}
import ebayapp.common.errors.AppError
import ebayapp.domain.{ItemDetails, ResellableItem, ResellableItemBuilder}
import ebayapp.domain.search._
import sttp.client3
import sttp.client3.{Response, SttpBackend}
import sttp.model.{Method, StatusCode}

import scala.concurrent.duration._

class CexClientSpec extends SttpClientSpec {

  "CexClient" should {

    val config = CexConfig(
      "http://cex.com",
      CexPriceFindConfig(3.seconds, 1.second),
      StockMonitorConfig(10.minutes, Nil)
    )

    "find items" in {
      val query = SearchQuery("macbook pro 16,1")
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "macbook pro 16,1", "inStock" -> "1", "inStockOnline" -> "1")) =>
            Response.ok(json("cex/search-macbook-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.findItem[ItemDetails.Generic](query))

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
                    None,
                    "USED / A",
                    res(0).listingDetails.datePosted,
                    "CEX",
                    Map()
                  ),
                  BuyPrice(2, 1950.0),
                  Some(SellPrice(BigDecimal(1131.0), BigDecimal(1365.0)))
                ),
                ResellableItem(
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
                  Some(SellPrice(BigDecimal(1044.0), BigDecimal(1260.0)))
                ),
                ResellableItem(
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
                  Some(SellPrice(BigDecimal(1276.0), BigDecimal(1540.0)))
                )
              )
            )
        )
    }

    "find minimal sell price for phones" in {
      val item = ResellableItemBuilder.mobilePhone("Apple", "iPhone 6S", "Grey")
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "Apple iPhone6S16GB Grey Unlocked")) =>
            Response.ok(json("cex/search-iphone-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(item))

      result.unsafeToFuture().map { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(108), BigDecimal(153)))
      }
    }

    "find minimal sell price for games" in {
      val item = ResellableItemBuilder.videoGame("UFC 3 2020", sellPrice = None, platform = Some("PLAYSTATION4"))
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "UFC3 2020 PLAYSTATION4", "categoryIds" -> "[1000,1147,1003,1141,1064,1146]")) =>
            Response.ok(json("cex/search-game-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(item))

      result.unsafeToFuture().map { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(0.8), BigDecimal(1.4)))
      }
    }

    "ignore items that cannot be sold anymore" in {
      val item = ResellableItemBuilder.videoGame("Need for speed", sellPrice = None, platform = Some("PLAYSTATION4"))
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "Need for speed PLAYSTATION4", "categoryIds" -> "[1000,1147,1003,1141,1064,1146]")) =>
            Response.ok(json("cex/search-game-cannotbuy-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(item))

      result.unsafeToFuture().map { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(6.0), BigDecimal(9.0)))
      }
    }

    "return resell price from cache" in {
      val item = ResellableItemBuilder.videoGame("super mario3", sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response.ok(json("cex/search-iphone-success-response.json")),
          Response(json("cex/search-error-response.json"), StatusCode.InternalServerError)
        )

      val result = for {
        cexClient <- CexClient.make[IO](config, testingBackend)
        _         <- cexClient.withUpdatedSellPrice(item)
        rp        <- cexClient.withUpdatedSellPrice(item)
      } yield rp

      result.unsafeToFuture().map { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(108), BigDecimal(153)))
      }
    }

    "not do anything when not enough details to query for price" in {
      val item = ResellableItemBuilder.videoGame("super mario 3", platform = None, sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(item))

      result.unsafeToFuture().map { updatedItem =>
        updatedItem.sellPrice mustBe None
      }
    }

    "perform another request after cache expired" in {
      val item = ResellableItemBuilder.videoGame("super mario 3", sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response.ok(json("cex/search-iphone-success-response.json")),
          Response.ok(json("cex/search-noresults-response.json"))
        )

      val result = for {
        cexClient <- CexClient.make[IO](config, testingBackend)
        _         <- cexClient.withUpdatedSellPrice(item)
        _         <- timer.sleep(4.seconds)
        rp        <- cexClient.withUpdatedSellPrice(item)
      } yield rp

      result.unsafeToFuture().map { res =>
        res.sellPrice mustBe None
      }
    }

    "return none when no results" in {
      val item = ResellableItemBuilder.videoGame("super mario 3", sellPrice = None, platform = Some("SWITCH"))
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "super mario3 SWITCH", "categoryIds" -> "[1000,1147,1003,1141,1064,1146]")) =>
            Response.ok(json("cex/search-noresults-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(item))

      result.unsafeToFuture().map { updatedItem =>
        updatedItem.sellPrice mustBe None
      }
    }

    "return internal error when failed to parse json" in {
      val item = ResellableItemBuilder.videoGame("super mario 3", sellPrice = None, platform = Some("SWITCH"))
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isQueryRequest(r, Map("q" -> "super mario3 SWITCH", "categoryIds" -> "[1000,1147,1003,1141,1064,1146]")) =>
            Response.ok(json("cex/search-unexpected-response.json"))
          case _ => throw new RuntimeException()
        }

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(item))

      result.attempt.unsafeToFuture().map { price =>
        price must be(
          Left(AppError.Json("error parsing json: C[A]: DownField(boxes),DownField(data),DownField(response)"))
        )
      }
    }

    "retry when 429 returned" in {
      val item = ResellableItemBuilder.videoGame("super mario 3", sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response(json("cex/search-error-response.json"), StatusCode.TooManyRequests),
          Response(json("cex/search-error-response.json"), StatusCode.TooManyRequests),
          Response.ok(json("cex/search-iphone-success-response.json"))
        )

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(item))

      result.unsafeToFuture().map { updatedItem =>
        updatedItem.sellPrice mustBe Some(SellPrice(BigDecimal(108), BigDecimal(153)))
      }
    }

    "retry on others http errors" in {
      val item = ResellableItemBuilder.videoGame("super mario 3", sellPrice = None)
      val testingBackend: SttpBackend[IO, Any] = backendStub.whenAnyRequest
        .thenRespondCyclicResponses(
          Response(json("cex/search-error-response.json"), StatusCode.BadRequest),
          Response(json("cex/search-error-response.json"), StatusCode.BadRequest),
          Response.ok(json("cex/search-iphone-success-response.json"))
        )

      val cexClient = CexClient.make[IO](config, testingBackend)

      val result = cexClient.flatMap(_.withUpdatedSellPrice(item))

      result.unsafeToFuture().map { item =>
        item.sellPrice mustBe Some(SellPrice(BigDecimal(108), BigDecimal(153)))
      }
    }

    def isQueryRequest(req: client3.Request[_, _], params: Map[String, String]): Boolean =
      isGoingTo(req, Method.GET, "cex.com", List("v3", "boxes"), params)
  }
}
