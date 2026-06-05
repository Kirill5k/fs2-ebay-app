package ebayapp.core.clients.jd

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.clients.CurlImpersonateClient
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria}
import kirill5k.common.cats.test.IOWordSpec
import kirill5k.common.test.FileReader
import sttp.model.StatusCode

import scala.concurrent.duration.*

class JdClientSpec extends IOWordSpec {

  "A JdsportsClient" should {
    val jdsportsConfig = GenericRetailerConfig("http://jdsports.com/proxy", delayBetweenIndividualRequests = Some(0.millis))
    val config         = MockRetailConfigProvider.make[IO](jdsportsConfig = Some(jdsportsConfig))

    "return items on sale" in {
      val criteria = SearchCriteria("Emporio Armani EA7", category = Some("men"))

      val client = mock[CurlImpersonateClient[IO]]
      when(client.get(
        eqTo("http://jdsports.com/proxy/men/brand/emporio-armani-ea7/?max=50&from=0&sort=price-low-high&AJAX=1"),
        any[Map[String, String]]
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("jdsports/search-by-brand-ajax.html")))
      when(client.get(
        eqTo("http://jdsports.com/proxy/product/white-ea7-emporio-armani-carbon-block-logo-t-shirt/19670520/stock/"),
        any[Map[String, String]]
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("jdsports/get-product-stock.html")))
      when(client.get(
        eqTo("http://jdsports.com/proxy/product/brown-ea7-emporio-armani-logo-joggers/19581391/stock/"),
        any[Map[String, String]]
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("jdsports/get-product-stock-oos.html")))

      JdClient
        .curlImpersonateJdsports[IO](config, client)
        .flatMap(_.search(criteria).compile.toList)
        .asserting { items =>
          items.map(_.itemDetails) mustBe List(
            Clothing("Men's Tape 2 T-Shirt (Black, 16022719)", "Emporio Armani EA7", "S"),
            Clothing("Men's Tape 2 T-Shirt (Black, 16022719)", "Emporio Armani EA7", "M")
          )
          items.map(_.listingDetails.url) mustBe List(
            "http://jdsports.com/proxy/product/black-mens-emporio-armani-ea7-tape-2-t-shirt/16022719/",
            "http://jdsports.com/proxy/product/black-mens-emporio-armani-ea7-tape-2-t-shirt/16022719/"
          )

          items.flatMap(_.listingDetails.image) mustBe List(
            "https://i8.amplience.net/i/jpl/jd_377478_a.jpeg",
            "https://i8.amplience.net/i/jpl/jd_377478_a.jpeg"
          )

          items.map(_.buyPrice).toSet mustBe Set(BuyPrice(1, BigDecimal(20.0), Some(67)))
        }
    }
  }
}
