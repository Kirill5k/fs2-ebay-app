package ebayapp.core.clients.frasers

import ebayapp.core.clients.frasers.parsers.ResponseParser
import kirill5k.common.test.FileReader
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ResponseParserSpec extends AnyWordSpec with Matchers {
  
  "A ResponseParser" when {

    "parseItemsFromBrandPageResponse" should {
      "parse items from the html response" in {
        val result = ResponseParser.parseItemsFromBrandPageResponse(html("frasers/brand-page1.html"))
  
        ???
      }
    }
  }

  def html(path: String): String = FileReader.fromResources(path)
}

