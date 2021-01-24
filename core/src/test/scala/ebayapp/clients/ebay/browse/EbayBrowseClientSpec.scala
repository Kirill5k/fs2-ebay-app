package ebayapp.clients.ebay.browse

import cats.effect.IO
import ebayapp.SttpClientSpec
import ebayapp.common.config.{EbayConfig, EbayCredentials, EbayDealsConfigs, EbaySearchConfig, EbayDealsConfig}
import ebayapp.common.errors.AppError
import sttp.client3.{Response, SttpBackend}
import sttp.model.{Method, StatusCode}

import scala.concurrent.duration._

class EbayBrowseClientSpec extends SttpClientSpec {

  val accessToken = "access-token"
  val itemId = "item-id-1"
  val searchQueryParams = Map("q" -> "iphone")

  val deals = EbayDealsConfigs(EbayDealsConfig(60.seconds, Nil, 20.minutes, 34, 10))
  val credentials = List(EbayCredentials("id-1", "secret-1"), EbayCredentials("id-2", "secret-2"))
  val config      = EbayConfig("http://ebay.com", credentials, EbaySearchConfig(5, 92), deals)

  "EbaySearchClient" should {

    "make get request to search api" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isGoingToWithSpecificContent(r, Method.GET, "ebay.com", List("buy", "browse", "v1", "item_summary", "search"), searchQueryParams) =>
            Response.ok(json("ebay/search-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val foundItems = ebaySearchClient.flatMap(_.search(accessToken, searchQueryParams))

      foundItems.unsafeToFuture().map { items =>
        items.map(_.itemId) must be (List("item-1", "item-2", "item-3", "item-4", "item-5"))
      }
    }

    "return empty seq when nothing found" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isGoingToWithSpecificContent(r, Method.GET, "ebay.com", List("buy", "browse", "v1", "item_summary", "search"), searchQueryParams) =>
            Response.ok(json("ebay/search-empty-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val foundItems = ebaySearchClient.flatMap(_.search(accessToken, searchQueryParams))

      foundItems.unsafeToFuture().map { items =>
        items must be (Nil)
      }
    }

    "return autherror when token expired during search" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isGoingToWithSpecificContent(r, Method.GET, "ebay.com", List("buy", "browse", "v1", "item_summary", "search"), searchQueryParams) =>
            Response(json("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden)
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val result = ebaySearchClient.flatMap(_.search(accessToken, searchQueryParams))

      result.attempt.unsafeToFuture().map { error =>
        error must be (Left(AppError.Auth("ebay account has expired: 403")))
      }
    }

    "make get request to obtain item details" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isGoingToWithSpecificContent(r, Method.GET, "ebay.com", List("buy", "browse", "v1", "item", itemId)) =>
            Response.ok(json("ebay/get-item-1-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val itemResult = ebaySearchClient.flatMap(_.getItem(accessToken, itemId))

      itemResult.unsafeToFuture().map { item =>
        item.map(_.itemId) must be (Some("v1|114059888671|0"))
      }
    }

    "make get request to obtain item details without aspects" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isGoingToWithSpecificContent(r, Method.GET, "ebay.com", List("buy", "browse", "v1", "item", itemId)) =>
            Response.ok(json("ebay/get-item-3-no-aspects-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val itemResult = ebaySearchClient.flatMap(_.getItem(accessToken, itemId))

      itemResult.unsafeToFuture().map { item =>
        item.map(_.localizedAspects) must be (Some(None))
      }
    }

    "return autherror when token expired" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isGoingToWithSpecificContent(r, Method.GET, "ebay.com", List("buy", "browse", "v1", "item", itemId)) =>
            Response(json("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden)
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val result = ebaySearchClient.flatMap(_.getItem(accessToken, itemId))

      result.attempt.unsafeToFuture().map { error =>
        error must be (Left(AppError.Auth("ebay account has expired: 403")))
      }
    }

    "return None when 404" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if isGoingToWithSpecificContent(r, Method.GET, "ebay.com", List("buy", "browse", "v1", "item", itemId)) =>
            Response(json("ebay/get-item-notfound-error-response.json"), StatusCode.NotFound)
          case _ => throw new RuntimeException()
        }

      val ebaySearchClient = EbayBrowseClient.make[IO](config, testingBackend)
      val itemResult = ebaySearchClient.flatMap(_.getItem(accessToken, itemId))

      itemResult.unsafeToFuture().map { items =>
        items must be (None)
      }
    }
  }
}
