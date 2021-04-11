package ebayapp.clients.jdsports

import ebayapp.clients.jdsports.parsers.{ItemStock, ResponseParser}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.io.Source

class ResponseParserSpec extends AnyWordSpec with Matchers {

  "A ResponseParser" when {

    "parseSearchResponse" should {
      "parse raw html search response into list of objects" in {
        val result = ResponseParser.parseSearchResponse(html("jdsports/search-by-brand.html"))

        result mustBe Right(Nil)
      }
    }

    "parseStockResponse" should {
      "return available sizes" in {
        val result = ResponseParser.parseStockResponse(html("jdsports/get-stock-multiple.html"))

        result mustBe Right(ItemStock(List("XS", "S", "M", "L", "XL", "XXL")))
      }

      "return single size when only 1 is available" in {
        val result = ResponseParser.parseStockResponse(html("jdsports/get-stock-single.html"))

        result mustBe Right(ItemStock(List("ONE SIZE")))
      }

      "return nil when out of stock" in {
        val result = ResponseParser.parseStockResponse(html("jdsports/get-stock-oos.html"))

        result mustBe Right(ItemStock(Nil))
      }
    }
  }

  def html(path: String): String = Source.fromResource(path).getLines().toList.mkString
}
