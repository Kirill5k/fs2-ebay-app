package ebayapp.clients.jdsports

import ebayapp.clients.jdsports.parsers.ResponseParser
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.io.Source

class ResponseParserSpec extends AnyWordSpec with Matchers {

  "A ResponseParser" should {

    "parse raw html search response into list of objects" in {
      val result = ResponseParser.parseSearchResponse(html("jdsports/search-by-brand.html"))

      result mustBe Right(Nil)
    }
  }

  def html(path: String): String = Source.fromResource(path).getLines().toList.mkString
}
