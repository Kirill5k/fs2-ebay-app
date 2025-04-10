package ebayapp.core.clients.ebay.browse

import cats.effect.IO
import ebayapp.core.MockLogger.given
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.common.config.{EbayConfig, EbaySearchConfig, OAuthCredentials}
import ebayapp.kernel.errors.AppError
import kirill5k.common.sttp.test.Sttp4WordSpec
import sttp.client4.testing.ResponseStub
import sttp.model.StatusCode

import scala.concurrent.duration.*

class EbayBrowseClientSpec extends Sttp4WordSpec {

  val accessToken       = "access-token"
  val itemId            = "item-id-1"
  val searchQueryParams = Map("q" -> "iphone", "filter" -> "buyingOptions:{FIXED_PRICE}")

  val credentials = List(OAuthCredentials("id-1", "secret-1"), OAuthCredentials("id-2", "secret-2"))
  val ebayConfig  = EbayConfig("http://ebay.com", credentials, EbaySearchConfig(5, 92, 20.minutes))
  val config      = MockRetailConfigProvider.make[IO](ebayConfig = Some(ebayConfig))

  "EbaySearchClient" should {

    "make get request to search api" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("ebay.com/buy/browse/v1/item_summary/search") && r.hasParams(searchQueryParams) =>
            ResponseStub.adjust(readJson("ebay/search-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- EbayBrowseClient.make[IO](config, testingBackend)
        res    <- client.search(accessToken, searchQueryParams)
      yield res

      result.asserting { items =>
        items.map(_.itemId) mustBe List("item-1", "item-2", "item-3", "item-4", "item-5")
      }
    }

    "return empty seq when nothing found" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("ebay.com/buy/browse/v1/item_summary/search") && r.hasParams(searchQueryParams) =>
            ResponseStub.adjust(readJson("ebay/search-empty-response.json"))
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- EbayBrowseClient.make[IO](config, testingBackend)
        res    <- client.search(accessToken, searchQueryParams)
      yield res

      result.asserting { items =>
        items mustBe Nil
      }
    }

    "return autherror when token expired during search" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo("ebay.com/buy/browse/v1/item_summary/search") && r.hasParams(searchQueryParams) =>
            ResponseStub.adjust(readJson("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden)
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- EbayBrowseClient.make[IO](config, testingBackend)
        res    <- client.search(accessToken, searchQueryParams)
      yield res

      result.assertThrows(AppError.Auth("ebay account has expired: 403"))
    }

    "make get request to obtain item details" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(s"ebay.com/buy/browse/v1/item/$itemId") =>
            ResponseStub.adjust(readJson("ebay/get-item-1-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- EbayBrowseClient.make[IO](config, testingBackend)
        res    <- client.getItem(accessToken, itemId)
      yield res

      result.asserting { item =>
        item.map(_.itemId) mustBe (Some("v1|114059888671|0"))
      }
    }

    "make get request to obtain item details without aspects" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(s"ebay.com/buy/browse/v1/item/$itemId") =>
            ResponseStub.adjust(readJson("ebay/get-item-3-no-aspects-success-response.json"))
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- EbayBrowseClient.make[IO](config, testingBackend)
        res    <- client.getItem(accessToken, itemId)
      yield res

      result.asserting { item =>
        item.map(_.localizedAspects) mustBe (Some(None))
      }
    }

    "return autherror when token expired" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(s"ebay.com/buy/browse/v1/item/$itemId") =>
            ResponseStub.adjust(readJson("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden)
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- EbayBrowseClient.make[IO](config, testingBackend)
        res    <- client.getItem(accessToken, itemId)
      yield res

      result.assertThrows(AppError.Auth("ebay account has expired: 403"))
    }

    "return None when 404" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.isGoingTo(s"ebay.com/buy/browse/v1/item/$itemId") =>
            ResponseStub.adjust(readJson("ebay/get-item-notfound-error-response.json"), StatusCode.NotFound)
          case _ => throw new RuntimeException()
        }

      val result = for
        client <- EbayBrowseClient.make[IO](config, testingBackend)
        res    <- client.getItem(accessToken, itemId)
      yield res

      result.asserting { items =>
        items mustBe None
      }
    }

    "return item from cache when itemid is the same" in {
      val testingBackend = fs2BackendStub.whenAnyRequest
        .thenRespondCyclic(
          ResponseStub.adjust(readJson("ebay/get-item-1-success-response.json")),
          ResponseStub.adjust(readJson("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden),
          ResponseStub.adjust(readJson("ebay/get-item-unauthorized-error-response.json"), StatusCode.Forbidden)
        )

      val result = for
        client <- EbayBrowseClient.make[IO](config, testingBackend)
        item1  <- client.getItem(accessToken, itemId)
        item2  <- client.getItem(accessToken, itemId)
        item3  <- client.getItem(accessToken, itemId)
      yield List(item1, item2, item3)

      result.asserting { items =>
        items must have size 3
      }
    }
  }
}
