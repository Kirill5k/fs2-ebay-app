package ebayapp.clients.jdsports

import ebayapp.clients.jdsports.parsers.{JdCatalogItem, JdItemDetails, JdItemStock, ResponseParser}
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

      "parse another html with errors" in {
        val result = ResponseParser.parseSearchResponse(html("jdsports/search-by-brand-2.html"))

        result.isRight mustBe true
      }
    }

    "parseItemDetails" should {
      "parse item details" in {
        val result = ResponseParser.parseItemDetails(html("jdsports/get-item.html"))

        result mustBe Right(
          JdItemDetails(
            "16022719",
            "Emporio Armani EA7 Tape 2 T-Shirt",
            BigDecimal(20.00),
            Some(BigDecimal(50.00)),
            "Emporio Armani EA7",
            "men",
            "black",
            "https://i8.amplience.net/i/jpl/jd_366443_a?qlt=92"
          )
        )
      }
    }

    "parseStockResponse" should {
      "return available sizes" in {
        val result = ResponseParser.parseStockResponse(html("jdsports/get-stock-multiple.html"))

        result mustBe Right(JdItemStock(List("XS", "S", "M")))
      }

      "return single size when only 1 is available" in {
        val result = ResponseParser.parseStockResponse(html("jdsports/get-stock-single.html"))

        result mustBe Right(JdItemStock(List("ONE SIZE")))
      }

      "return nil when out of stock" in {
        val result = ResponseParser.parseStockResponse(html("jdsports/get-stock-oos.html"))

        result mustBe Right(JdItemStock(Nil))
      }
    }
  }

  def html(path: String): String = Source.fromResource(path).getLines().toList.mkString
}
