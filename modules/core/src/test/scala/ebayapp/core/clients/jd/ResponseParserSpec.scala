package ebayapp.core.clients.jd

import cats.syntax.either.*
import cats.syntax.option.*
import ebayapp.core.clients.jd.parsers.{JdCatalogItem, JdProduct, JdProductDetails, ResponseParser}
import kirill5k.common.test.FileReader
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ResponseParserSpec extends AnyWordSpec with Matchers {

  "A ResponseParser" when {

    "parseBrandAjaxResponse" should {
      "parse raw html search response into list of objects" in {
        val result = ResponseParser.parseBrandAjaxResponse(html("jdsports/search-by-brand-ajax.html"))

        result mustBe List(
          JdCatalogItem("19670520", "white", "EA7 Emporio Armani Carbon Block Logo T-Shirt", true),
          JdCatalogItem("19581391", "brown", "EA7 Emporio Armani Logo Joggers", true),
        ).asRight
      }

      "parse raw empty html search response" in {
        val result = ResponseParser.parseBrandAjaxResponse(html("jdsports/search-by-brand-ajax-empty.html"))

        result mustBe Nil.asRight
      }
    }

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

      "return no size when out of stock" in {
        val result = ResponseParser.parseProductStockResponse(html("jdsports/get-product-stock-oos.html"))

        result mustBe Right(None)
      }

      "handle nulls" in {
        val result = ResponseParser.parseProductStockResponse(null)

        result mustBe Right(None)
      }
    }
  }

  def html(path: String): String = FileReader.fromResources(path)
}
