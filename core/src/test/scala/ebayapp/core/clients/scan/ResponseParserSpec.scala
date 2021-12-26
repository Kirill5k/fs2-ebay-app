package ebayapp.core.clients.scan

import cats.syntax.either.*
import ebayapp.core.clients.scan.parsers.{ResponseParser, ScanItem}
import ebayapp.kernel.errors.AppError
import ebayapp.kernel.FileReader
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ResponseParserSpec extends AnyWordSpec with Matchers {

  "A Scan ResponseParser" when {

    "parseSearchResponse" should {

      "return list of items that are in stock" in {
        val html = FileReader.fromResources("scan/search-by-card.html")
        val result = ResponseParser.parseSearchResponse(html)

        result.map(_.head) mustBe
          ScanItem(
            "ZOTAC NVIDIA GeForce RTX 3090 24GB GAMING Trinity OC Ampere Graphics Card w/ AMD Ryzen 7 5800X CPU, 1710MHz Boost",
            "/products/zotac-nvidia-geforce-rtx-3090-24gb-gaming-trinity-oc-ampere-graphics-card-w-amd-ryzen-7-5800x-cpu-17",
            "https://www.scan.co.uk/images/products/to/3339312.jpg",
            2218.0
          ).asRight[AppError]
      }
    }
  }
}
