package ebayapp.core.clients.selfridges

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria}
import kirill5k.common.sttp.test.Sttp4WordSpec
import sttp.client4.GenericRequest
import sttp.model.StatusCode
import sttp.client4.testing.ResponseStub

class SelfridgesClientSpec extends Sttp4WordSpec {

  "A SelfridgesClient" should {

    val selfridgesConfig = GenericRetailerConfig("http://selfridges.com", Map("api-key" -> "foo-bar"))
    val config           = MockRetailConfigProvider.make[IO](selfridgesConfig = Some(selfridgesConfig))

    val criteria = SearchCriteria("EA7 Armani")

    "return stream of clothing items that are on sale" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if isSearchRequest(r, Map("pageSize" -> "60", "pageNumber" -> "1", "ids" -> "EA7-Armani")) =>
            ResponseStub.adjust(readJson("selfridges/search-page-1.json"))
          case r if isSearchRequest(r, Map("pageSize" -> "60", "pageNumber" -> "2", "ids" -> "EA7-Armani")) =>
            ResponseStub.adjust(readJson("selfridges/search-page-2.json"))
          case r if isSearchRequest(r, Map("pageSize" -> "60", "pageNumber" -> "3", "ids" -> "EA7-Armani")) =>
            ResponseStub.adjust(readJson("selfridges/search-page-3.json"))
          case r if isSearchRequest(r, Map("pageSize" -> "60", "pageNumber" -> "4", "ids" -> "EA7-Armani")) =>
            ResponseStub.adjust(readJson("selfridges/search-page-4.json"))
          case r if isGetStockRequest(r, "R03631644") =>
            ResponseStub.adjust(readJson("selfridges/stock-R03631644.json"))
          case r if isGetStockRequest(r, "R03631641") =>
            ResponseStub.adjust(readJson("selfridges/stock-R03631641.json"))
          case r if isGetStockRequest(r, "R03631642") =>
            ResponseStub.adjust(readJson("selfridges/stock-R03631642.json"))
          case r if isGetPriceRequest(r, "R03631644") =>
            ResponseStub.adjust(readJson("selfridges/price-R03631644.json"))
          case r if isGetPriceRequest(r, "R03631641") =>
            ResponseStub.adjust(readJson("selfridges/price-R03631641.json"))
          case r if isGetPriceRequest(r, "R03631642") =>
            ResponseStub.adjust(readJson("selfridges/price-R03631642.json"))
          case _ => throw new RuntimeException()
        }

      val res = for
        client <- SelfridgesClient.make[IO](config, testingBackend)
        items  <- client.search(criteria).compile.toList
      yield items

      res.asserting { items =>
        items must have size 16
        val firstItem  = items.head
        val secondItem = items.drop(6).head

        firstItem.itemDetails mustBe Clothing("Brand-badge stretch-jersey hoody", "EA7 Armani", "XL")
        secondItem.itemDetails mustBe Clothing("Brand print cotton blend jersey sweatshirt", "EA7 Armani", "S")

        items.map(_.buyPrice).distinct mustBe List(
          BuyPrice(1, BigDecimal(20.0), Some(86)),
          BuyPrice(1, BigDecimal(10.0), Some(90)),
          BuyPrice(1, BigDecimal(50.0), Some(60))
        )
      }
    }

    "return empty stream in case of errors" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if isSearchRequest(r, Map("pageSize" -> "60", "pageNumber" -> "1", "ids" -> "EA7-Armani")) =>
            ResponseStub.adjust("foo-bar", StatusCode.BadRequest)
          case _ => throw new RuntimeException()
        }

      val res = for
        client <- SelfridgesClient.make[IO](config, testingBackend)
        items  <- client.search(criteria).compile.toList
      yield items

      res.asserting(_ mustBe Nil)
    }

    "return empty stream when failed to deserialize response" in {
      val testingBackend = fs2BackendStub
        .whenRequestMatchesPartial {
          case r if isSearchRequest(r, Map("pageSize" -> "60", "pageNumber" -> "1", "ids" -> "EA7-Armani")) =>
            ResponseStub.adjust("""{"foo":"bar"}""")
          case _ => throw new RuntimeException()
        }

      val res = for
        client <- SelfridgesClient.make[IO](config, testingBackend)
        items  <- client.search(criteria).compile.toList
      yield items

      res.asserting(_ mustBe Nil)
    }
  }

  def isSearchRequest(req: GenericRequest[?, ?], params: Map[String, String]): Boolean =
    req.isGet
      && req.isGoingTo("selfridges.com/api/cms/ecom/v1/GB/en/productview/byCategory/byIds")
      && req.hasParams(params)

  def isGetStockRequest(req: GenericRequest[?, ?], id: String): Boolean =
    req.isGet && req.isGoingTo(s"selfridges.com/api/cms/ecom/v1/GB/en/stock/byId/$id")

  def isGetPriceRequest(req: GenericRequest[?, ?], id: String): Boolean =
    req.isGet && req.isGoingTo(s"selfridges.com/api/cms/ecom/v1/GB/en/price/byId/$id")
}
