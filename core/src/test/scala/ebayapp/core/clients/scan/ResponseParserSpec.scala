package ebayapp.core.clients.scan

import cats.implicits._
import ebayapp.core.clients.scan.parsers.{ResponseParser, ScanItem}
import ebayapp.core.common.errors.AppError
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.io.Source

class ResponseParserSpec extends AnyWordSpec with Matchers {

  "A Scan ResponseParser" when {

    "parseSearchResponse" should {

      "return list of items that are in stock" in {
        val result = ResponseParser.parseSearchResponse(html("scan/search-by-card.html"))

        result mustBe List(
          ScanItem(
            "PowerColor Radeon RX 6900 XT Red Devil 16GB GDDR6 Ray-Tracing Graphics Card, RDNA2, 5120 Streams, 2015MHz, 2250MHz Boost",
            "/products/powercolor-radeon-rx-6900-xt-red-devil-16gb-gddr6-ray-tracing-graphics-card-rdna2-5120-streams-2015m",
            "https://www.scan.co.uk/images/products/to/3260121.jpg",
            1679.0
          ),
          ScanItem(
            "ASRock Radeon RX 6900 XT Phantom Gaming OC 16GB GDDR6 Ray-Tracing Card, RDNA2, 5120 Streams, 1925MHz GPU, 2340MHz Boost",
            "/products/asrock-radeon-rx-6900-xt-phantom-gaming-oc-16gb-gddr6-ray-tracing-card-rdna2-5120-streams-1925mhz-gp",
            "https://www.scan.co.uk/images/products/to/3279954.jpg",
            1714.0
          )
        ).asRight[AppError]
      }
    }
  }

  def html(path: String): String = Source.fromResource(path).getLines().toList.mkString
}
