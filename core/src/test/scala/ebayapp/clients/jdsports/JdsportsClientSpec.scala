package ebayapp.clients.jdsports

import cats.effect.IO
import ebayapp.SttpClientSpec
import ebayapp.requests._
import ebayapp.common.config.{JdsportsConfig, SearchQuery}
import ebayapp.domain.ItemDetails.Clothing
import ebayapp.domain.search.BuyPrice
import sttp.client3.{Response, SttpBackend}

class JdsportsClientSpec extends SttpClientSpec {

  "A JdsportsClient" should {

    val config = JdsportsConfig(
      "http://jdsports.com"
    )

    val query = SearchQuery("Emporio Armani EA7")

    "return items on sale" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGoingTo("jdsports.com/men/brand/emporio-armani-ea7") =>
            Response.ok(json("jdsports/search-by-brand.html"))
          case r if r.isGoingTo("jdsports.com/product/black-emporio-armani-ea7-tape-2-t-shirt/16022719/quickview/stock") =>
            Response.ok(json("jdsports/get-stock-multiple.html"))
          case r if r.isGoingTo("jdsports.com/product/black-emporio-armani-ea7-padded-zip-bubble-jacket/16026576/quickview") =>
            Response.ok(json("jdsports/get-item-2.html"))
          case r if r.isGoingTo("jdsports.com/product/black-emporio-armani-ea7-tape-2-t-shirt/16022719/quickview") =>
            Response.ok(json("jdsports/get-item.html"))
          case r if r.isGoingTo("jdsports.com/product/black-emporio-armani-ea7-padded-zip-bubble-jacket/16026576/quickview/stock") =>
            Response.ok(json("jdsports/get-stock-oos.html"))
          case r => throw new RuntimeException(r.uri.toString())
        }

      val client = JdsportsClient.make[IO](config, testingBackend)

      client.flatMap(_.searchSale(query).compile.toList).unsafeToFuture().map { items =>
        items must have size 3
        items.map(_.itemDetails) mustBe List(
          Clothing("Emporio Armani EA7 Tape 2 T-Shirt", "Emporio Armani EA7", "XS"),
          Clothing("Emporio Armani EA7 Tape 2 T-Shirt", "Emporio Armani EA7", "S"),
          Clothing("Emporio Armani EA7 Tape 2 T-Shirt", "Emporio Armani EA7", "M")
        )

        items.map(_.buyPrice) mustBe Set(
          BuyPrice(1, BigDecimal(20.0), Some(60))
        )
      }
    }
  }
}
