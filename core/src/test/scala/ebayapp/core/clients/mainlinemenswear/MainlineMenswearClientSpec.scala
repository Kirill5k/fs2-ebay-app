package ebayapp.core.clients.mainlinemenswear

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.core.MockLogger
import ebayapp.core.clients.SearchCriteria
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.BuyPrice
import ebayapp.kernel.SttpClientSpec
import sttp.client3
import sttp.client3.{Response, SttpBackend}
import sttp.model.{Method, StatusCode}

class MainlineMenswearClientSpec extends SttpClientSpec {

  given logger: Logger[IO] = MockLogger.make[IO]

  "A MainlineMenswearClient" should {

    val config = GenericRetailerConfig("http://mainlinemenswear.com", Map("Authorization" -> "Bearer foo-bar"))
    val criteria = SearchCriteria("emporio armani")

    "return items that are on sale" in {
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isPost && r.isGoingTo(s"mainlinemenswear.com/app/mmw/m/search/${criteria.query}") && r.bodyContains(""""page": 1""") =>
            Response.ok(json("mainline-menswear/search-response-1.json"))
          case r if r.isPost && r.isGoingTo(s"mainlinemenswear.com/app/mmw/m/search/${criteria.query}") && r.bodyContains(""""page": 2""") =>
            Response.ok(json("mainline-menswear/search-response-2.json"))
          case r if r.isPost && r.isGoingTo("mainlinemenswear.com/app/mmw/m/product/149663") && r.hasBearerToken("foo-bar") =>
            Response.ok(json("mainline-menswear/product-response-149663.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      val client = MainlineMenswearClient.make[IO](config, testingBackend)

      client.flatMap(_.search(criteria).compile.toList).unsafeToFuture().map { items =>
        items must have size 4
        val item = items.head

        item.itemDetails mustBe Clothing("Emporio Armani Crew Neck Logo T Shirt Black", "Armani", "Medium")
        item.listingDetails.url mustBe "https://www.mainlinemenswear.co.uk/product/emporio-armani-crew-neck-logo-t-shirt-black/149663"
        item.listingDetails.image mustBe Some("https://cdn.mainlinemenswear.co.uk/f_auto,q_auto/mainlinemenswear/shopimages/products/149663/Mainimage.jpg")

        items.map(_.buyPrice) mustBe List(
          BuyPrice(5, BigDecimal(51.98), Some(51)),
          BuyPrice(2, BigDecimal(51.98), Some(51)),
          BuyPrice(3, BigDecimal(51.98), Some(51)),
          BuyPrice(2, BigDecimal(51.98), Some(51)),
        )
      }
    }
  }
}
