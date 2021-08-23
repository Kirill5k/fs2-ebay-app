package ebayapp.core.clients.ebay.browse

import cats.effect.IO
import ebayapp.core.SttpClientSpec
import ebayapp.core.common.config.{EbayConfig, EbayCredentials, EbaySearchConfig}
import ebayapp.core.common.errors.AppError
import ebayapp.core.requests._
import sttp.client3.{Response, SttpBackend}
import sttp.model.StatusCode

import scala.concurrent.duration._

class EbayBrowseClientSpec extends SttpClientSpec {

  val accessToken       = "access-token"
  val itemId            = "item-id-1"
  val searchQueryParams = Map("q" -> "iphone")

  val credentials = List(EbayCredentials("id-1", "secret-1"), EbayCredentials("id-2", "secret-2"))
  val config      = EbayConfig("http://ebay.com", credentials, EbaySearchConfig(5, 92, 20.minutes))

  "EbaySearchClient" should {

    "make get request to search api" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("ebay.com/buy/browse/v1/item_summary/search") && r.hasParams(searchQueryParams) =>
            Response.ok(json("ebay/search-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val foundItems       = ebaySearchClient.flatMap(_.search(accessToken, searchQueryParams))

      foundItems.unsafeToFuture().map { items =>
        items.map(_.itemId) mustBe (List("item-1", "item-2", "item-3", "item-4", "item-5"))
      }
    }

    "return empty seq when nothing found" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("ebay.com/buy/browse/v1/item_summary/search") && r.hasParams(searchQueryParams) =>
            Response.ok(json("ebay/search-empty-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val foundItems       = ebaySearchClient.flatMap(_.search(accessToken, searchQueryParams))

      foundItems.unsafeToFuture().map { items =>
        items mustBe Nil
      }
    }

    "return autherror when token expired during search" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("ebay.com/buy/browse/v1/item_summary/search") && r.hasParams(searchQueryParams) =>
            Response(json("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden)
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val result           = ebaySearchClient.flatMap(_.search(accessToken, searchQueryParams))

      result.attempt.unsafeToFuture().map { error =>
        error mustBe (Left(AppError.Auth("ebay account has expired: 403")))
      }
    }

    "make get request to obtain item details" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(s"ebay.com/buy/browse/v1/item/$itemId") =>
            Response.ok(json("ebay/get-item-1-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val itemResult       = ebaySearchClient.flatMap(_.getItem(accessToken, itemId))

      itemResult.unsafeToFuture().map { item =>
        item.map(_.itemId) mustBe (Some("v1|114059888671|0"))
      }
    }

    "make get request to obtain item details without aspects" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(s"ebay.com/buy/browse/v1/item/$itemId") =>
            Response.ok(json("ebay/get-item-3-no-aspects-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val itemResult       = ebaySearchClient.flatMap(_.getItem(accessToken, itemId))

      itemResult.unsafeToFuture().map { item =>
        item.map(_.localizedAspects) mustBe (Some(None))
      }
    }

    "return autherror when token expired" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(s"ebay.com/buy/browse/v1/item/$itemId") =>
            Response(json("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden)
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val result           = ebaySearchClient.flatMap(_.getItem(accessToken, itemId))

      result.attempt.unsafeToFuture().map { error =>
        error mustBe (Left(AppError.Auth("ebay account has expired: 403")))
      }
    }

    "return None when 404" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(s"ebay.com/buy/browse/v1/item/$itemId") =>
            Response(json("ebay/get-item-notfound-error-response.json"), StatusCode.NotFound)
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val itemResult       = ebaySearchClient.flatMap(_.getItem(accessToken, itemId))

      itemResult.unsafeToFuture().map { items =>
        items mustBe None
      }
    }

    "return item from cache when itemid is the same" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenAnyRequest
        .thenRespondCyclicResponses(
          Response.ok(json("ebay/get-item-1-success-response.json")),
          Response(json("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden),
          Response(json("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden)
        )

      val result = for {
        client <- EbayBrowseClient.make[IO](config, testingBackend)
        item1 <- client.getItem(accessToken, itemId)
        item2 <- client.getItem(accessToken, itemId)
        item3 <- client.getItem(accessToken, itemId)
      } yield List(item1, item2, item3)

      result.unsafeToFuture().map { items =>
        items must have size 3
      }
    }
  }
}
