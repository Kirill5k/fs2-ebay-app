package ebayapp.core.clients.jd

import cats.effect.IO
import ebayapp.core.MockConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria}
import ebayapp.kernel.SttpClientSpec
import sttp.client3.{Response, SttpBackend}
import sttp.model.StatusCode

class JdClientSpec extends SttpClientSpec {

  "A JdsportsClient" should {
    val jdsportsConfig = GenericRetailerConfig("http://jdsports.com/proxy")
    val config         = MockConfigProvider.make[IO](jdsportsConfig = Some(jdsportsConfig))

    "return items on sale" in {
      val criteria = SearchCriteria("Emporio Armani EA7", category = Some("men"))

      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGoingTo("jdsports.com/proxy/men/brand/emporio-armani-ea7") && r.hasParams(Map("from" -> "0")) =>
            Response.ok(json("jdsports/search-by-brand.html"))
          case r if r.isGoingTo("jdsports.com/proxy/men/brand/emporio-armani-ea7") =>
            Response("n/a", StatusCode.NotFound)
          case r if r.isGoingTo("jdsports.com/proxy/product/black-emporio-armani-ea7-tape-2-t-shirt/16022719/stock/") =>
            Response.ok(json("jdsports/get-product-stock.html"))
          case r if r.isGoingTo("jdsports.com/proxy/product/black-emporio-armani-ea7-padded-zip-bubble-jacket/16026576/stock/") =>
            Response.ok(json("jdsports/get-product-stock-oos.html"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = JdClient.jdsports[IO](config, testingBackend)

      client.flatMap(_.search(criteria).compile.toList).asserting { items =>
        items.map(_.itemDetails) mustBe List(
          Clothing("Men's Tape 2 T-Shirt (Black, 16022719)", "Emporio Armani EA7", "S"),
          Clothing("Men's Tape 2 T-Shirt (Black, 16022719)", "Emporio Armani EA7", "M")
        )
        items.map(_.listingDetails.url) mustBe List(
          "http://jdsports.com/proxy/product/black-mens-emporio-armani-ea7-tape-2-t-shirt/16022719/",
          "http://jdsports.com/proxy/product/black-mens-emporio-armani-ea7-tape-2-t-shirt/16022719/"
        )

        items.map(_.buyPrice).toSet mustBe Set(BuyPrice(1, BigDecimal(20.0), Some(67)))
      }
    }
  }
}
