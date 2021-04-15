package ebayapp.core.clients.jdsports

import cats.effect.IO
import ebayapp.core.SttpClientSpec
import ebayapp.core.requests._
import ebayapp.core.common.config.{JdsportsConfig, SearchQuery, StockMonitorConfig}
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.BuyPrice
import sttp.client3.{Response, SttpBackend}

import scala.concurrent.duration._

class JdsportsClientSpec extends SttpClientSpec {

  "A JdsportsClient" should {

    val config = JdsportsConfig(
      "http://jdsports.com/proxy",
      StockMonitorConfig(10.second, Nil)
    )

    val query = SearchQuery("Emporio Armani EA7")

    "return items on sale" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGoingTo("jdsports.com/proxy/men/brand/emporio-armani-ea7") =>
            Response.ok(json("jdsports/search-by-brand.html"))
          case r if r.isGoingTo("jdsports.com/proxy/product/black-emporio-armani-ea7-tape-2-t-shirt/16022719/stock") =>
            Response.ok(json("jdsports/get-product-stock.html"))
          case r if r.isGoingTo("jdsports.com/proxy/product/black-emporio-armani-ea7-padded-zip-bubble-jacket/16026576/stock") =>
            Response.ok(json("jdsports/get-product-stock-oos.html"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = JdsportsClient.make[IO](config, testingBackend)

      client.flatMap(_.searchSale(query).compile.toList).unsafeToFuture().map { items =>
        items must have size 2
        items.map(_.itemDetails) mustBe List(
          Clothing("Emporio Armani EA7 Tape 2 T-Shirt (black, 16022719)", "Emporio Armani EA7", "S"),
          Clothing("Emporio Armani EA7 Tape 2 T-Shirt (black, 16022719)", "Emporio Armani EA7", "M")
        )

        items.map(_.buyPrice).toSet mustBe Set(
          BuyPrice(1, BigDecimal(20.0), Some(67))
        )
      }
    }
  }
}
