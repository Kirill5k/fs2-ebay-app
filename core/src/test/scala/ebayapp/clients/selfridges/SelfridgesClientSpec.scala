package ebayapp.clients.selfridges

import cats.effect.IO
import ebayapp.SttpClientSpec
import ebayapp.common.config.{SearchQuery, SelfridgesConfig}
import ebayapp.domain.ItemDetails.Clothing
import ebayapp.domain.search.BuyPrice
import sttp.client
import sttp.client.{NothingT, Response, SttpBackend}
import sttp.model.Method

class SelfridgesClientSpec extends SttpClientSpec {

  "A SelfridgesClient" should {

    val config = SelfridgesConfig(
      "http://selfridges.com",
      "foo-bar"
    )

    val query = SearchQuery("EA7 Armani")

    "return stream of clothing items" in {
      val testingBackend: SttpBackend[IO, Nothing, NothingT] = backendStub
        .whenRequestMatchesPartial {
          case r if isSearchRequest(r, Map("pageSize" -> "60", "pageNumber" -> "1")) =>
            Response.ok(json("selfridges/search-page-1.json"))
          case r if isSearchRequest(r, Map("pageSize" -> "60", "pageNumber" -> "2")) =>
            Response.ok(json("selfridges/search-page-2.json"))
          case r if isSearchRequest(r, Map("pageSize" -> "60", "pageNumber" -> "3")) =>
            Response.ok(json("selfridges/search-page-3.json"))
          case r if isGetStockRequest(r, "R03631644") =>
            Response.ok(json("selfridges/stock-R03631644.json"))
          case r if isGetStockRequest(r, "R03631641") =>
            Response.ok(json("selfridges/stock-R03631641.json"))
          case r if isGetStockRequest(r, "R03631642") =>
            Response.ok(json("selfridges/stock-R03631642.json"))
          case _ => throw new RuntimeException()
        }

      val client = SelfridgesClient.make[IO](config, testingBackend)

      client.flatMap(_.search(query).compile.toList).unsafeToFuture().map { items =>
        items must have size 16
        val item = items.head

        item.buyPrice mustBe BuyPrice(0, BigDecimal(50.00), Some(63))
        item.itemDetails mustBe Clothing("Brand-badge stretch-jersey hoody", "EA7 ARMANI", "XS")
      }
    }
  }

  def isSearchRequest(req: client.Request[_, _], params: Map[String, String]): Boolean =
    isGoingTo(req, Method.GET, "selfridges.com", List("api", "cms", "ecom", "v1", "GB", "en", "search", "EA7 Armani"), params)

  def isGetStockRequest(req: client.Request[_, _], id: String): Boolean =
    isGoingTo(req, Method.GET, "selfridges.com", List("api", "cms", "ecom", "v1", "GB", "en", "stock", "byId", id))
}
