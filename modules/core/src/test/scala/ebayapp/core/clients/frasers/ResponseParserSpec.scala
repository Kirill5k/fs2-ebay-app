package ebayapp.core.clients.frasers

import ebayapp.core.clients.frasers.parsers.ResponseParser
import ebayapp.core.clients.frasers.responses.{FrasersProduct, FrasersSizeVariant}
import kirill5k.common.test.FileReader
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ResponseParserSpec extends AnyWordSpec with Matchers {

  "A ResponseParser" when {

    "parseItemsFromBrandPageResponse" should {
      "parse items from the html response" in {
        val result = ResponseParser.parseItemsFromBrandPageResponse(html("frasers/brand-page1.html"))

        val products = result.toOption.get
        products must have size 59
        products.head mustBe FrasersProduct(
          image = "https://cdn.media.amplience.net/i/frasersdev/48108702_o?fmt=auto&w=345&h=345&v=1",
          color = "Polv Mel V0M64",
          brand = "Stone Island",
          name = "Heavyweight Fleece Jogging Bottoms",
          sizeVariants = List(FrasersSizeVariant("2XL", "48108702510")),
          price = BigDecimal(340),
          discountedPrice = Some(BigDecimal(169)),
          productUrl = "stone-island-heavyweight-fleece-jogging-bottoms-481087#colcode=48108702",
          key = "48108702"
        )
      }

      "return an error when products array is not found" in {
        val result = ResponseParser.parseItemsFromBrandPageResponse("<html><body>no products here</body></html>")

        result mustBe a[Left[?, ?]]
      }
    }
  }

  def html(path: String): String = FileReader.fromResources(path)
}

