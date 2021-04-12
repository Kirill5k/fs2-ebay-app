package ebayapp.clients.jdsports

import ebayapp.clients.jdsports.parsers.{JdCatalogItem, JdProductDetails, JdProduct, ResponseParser}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.io.Source

class ResponseParserSpec extends AnyWordSpec with Matchers {

  "A ResponseParser" when {

    "parseSearchResponse" should {
      "parse raw html search response into list of objects" in {
        val result = ResponseParser.parseSearchResponse(html("jdsports/search-by-brand.html"))

        result mustBe Right(
          List(
            JdCatalogItem("16022719", "black", "Emporio Armani EA7 Tape 2 T-Shirt", true),
            JdCatalogItem("16026576", "black", "Emporio Armani EA7 Padded Zip Bubble Jacket", true),
            JdCatalogItem("1274081", "black", "Emporio Armani EA7 Train Mini Cross Body Bag", false)
          )
        )
      }
    }

    "parseProductStockResponse" should {
      "parse raw html product stock response into an object" in {
        val result = ResponseParser.parseProductStockResponse(html("jdsports/get-product-stock.html"))

        result mustBe Right(
          JdProduct(
            JdProductDetails(
              "16035629",
              "Calvin Klein Pocket Logo T-Shirt",
              BigDecimal(15.00),
              Some(BigDecimal(40.00)),
              "Calvin Klein",
              "men",
              "white",
              "https://i8.amplience.net/i/jpl/jd_377478_a?qlt=92"
            ),
            List("S", "M")
          )
        )
      }

      "should return no size when out of stock" in {
        val result = ResponseParser.parseProductStockResponse(html("jdsports/get-product-stock-oos.html"))

        result mustBe Right(
          JdProduct(
            JdProductDetails(
              "16035629",
              "Calvin Klein Pocket Logo T-Shirt",
              BigDecimal(15.00),
              Some(BigDecimal(40.00)),
              "Calvin Klein",
              "men",
              "white",
              "https://i8.amplience.net/i/jpl/jd_377478_a?qlt=92"
            ),
            Nil
          )
        )
      }
    }
  }

  def html(path: String): String = Source.fromResource(path).getLines().toList.mkString
}
