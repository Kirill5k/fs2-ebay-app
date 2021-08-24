package ebayapp.core.clients.jdsports

import cats.syntax.either._
import ebayapp.core.clients.jdsports.parsers.{JdCatalogItem, JdProduct, JdProductDetails, ResponseParser}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.io.Source

class ResponseParserSpec extends AnyWordSpec with Matchers {

  "A ResponseParser" when {

    "parseSearchResponse" should {
      "parse raw html search response into list of objects" in {
        val result = ResponseParser.parseSearchResponse(html("jdsports/search-by-brand.html"))

        result mustBe List(
          JdCatalogItem("16022719", "black", "Emporio Armani EA7 Tape 2 T-Shirt", true),
          JdCatalogItem("16026576", "black", "Emporio Armani EA7 Padded Zip Bubble Jacket", true),
          JdCatalogItem("1274081", "black", "Emporio Armani EA7 Train Mini Cross Body Bag", false)
        ).asRight
      }
    }

    "parseProductStockResponse" should {
      "parse raw html product stock response into an object" in {
        val result = ResponseParser.parseProductStockResponse(html("jdsports/get-product-stock.html"))

        result mustBe JdProduct(
          JdProductDetails(
            "16022719",
            "Men's Emporio Armani EA7 Tape 2 T-Shirt",
            BigDecimal(20.00),
            Some(BigDecimal(60.00)),
            "Emporio Armani EA7",
            "men",
            "black",
            "https://i8.amplience.net/i/jpl/jd_377478_a?qlt=92"
          ),
          List("S", "M")
        ).some.asRight
      }

      "should return no size when out of stock" in {
        val result = ResponseParser.parseProductStockResponse(html("jdsports/get-product-stock-oos.html"))

        result mustBe Right(None)
      }
    }
  }

  def html(path: String): String = Source.fromResource(path).getLines().toList.mkString
}
