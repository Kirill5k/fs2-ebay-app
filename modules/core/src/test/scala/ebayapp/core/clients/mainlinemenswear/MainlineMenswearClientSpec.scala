package ebayapp.core.clients.mainlinemenswear

import cats.effect.IO
import ebayapp.core.MockRetailConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria}
import kirill5k.common.sttp.test.SttpWordSpec
import sttp.capabilities.WebSockets
import sttp.capabilities.fs2.Fs2Streams
import sttp.client3
import sttp.client3.{Response, SttpBackend}
import sttp.model.{Header, StatusCode}

class MainlineMenswearClientSpec extends SttpWordSpec {

  val responseHeaders = List(
    Header("Content-Type", "text/html; charset=utf-8"),
    Header("set-cookie", "access_token=foo.bar; Max-Age=2592000; Path=/; HttpOnly; Secure"),
    Header("set-cookie", "access_token_expiry=1644568903; Max-Age=2592000; Path=/; HttpOnly; Secure"),
    Header("vary", "Accept-Encoding")
  )

  "A MainlineMenswearClient" should {

    val mainlineMenswearConfig = GenericRetailerConfig("http://mainline.com", Map("Authorization" -> "Bearer foo-bar"))
    val config                 = MockRetailConfigProvider.make[IO](mainlineMenswearConfig = Some(mainlineMenswearConfig))

    val criteria = SearchCriteria("emporio armani")

    "return items that are on sale" in {
      val testingBackend: SttpBackend[IO, Fs2Streams[IO] & WebSockets] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet =>
            Response("hello", StatusCode.Ok, "Ok", responseHeaders)
          case r
              if r.hasBearerToken("foo.bar") && r.isPost && r.isGoingTo(s"mainline.com/app/mmw/m/search/${criteria.query}") && r
                .bodyContains(""""page": 1""") =>
            Response.ok(readJson("mainline-menswear/search-response-1.json"))
          case r
              if r.hasBearerToken("foo.bar") && r.isPost && r.isGoingTo(s"mainline.com/app/mmw/m/search/${criteria.query}") && r
                .bodyContains(""""page": 2""") =>
            Response.ok(readJson("mainline-menswear/search-response-2.json"))
          case r if r.hasBearerToken("foo.bar") && r.isPost && r.isGoingTo("mainline.com/app/mmw/m/product/149663") =>
            Response.ok(readJson("mainline-menswear/product-response-149663.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      val client = MainlineMenswearClient.make[IO](config, testingBackend)

      client.flatMap(_.search(criteria).compile.toList).asserting { items =>
        items must have size 4
        val item = items.head

        item.itemDetails mustBe Clothing("Emporio Armani Crew Neck Logo T Shirt Black", "Armani", "M")
        item.listingDetails.url mustBe "https://www.mainlinemenswear.co.uk/product/emporio-armani-crew-neck-logo-t-shirt-black/149663"
        item.listingDetails.image mustBe Some(
          "https://cdn.mainlinemenswear.co.uk/f_auto,q_auto/mainlinemenswear/shopimages/products/149663/Mainimage.jpg"
        )

        items.map(_.buyPrice) mustBe List(
          BuyPrice(5, BigDecimal(51.98), Some(51)),
          BuyPrice(2, BigDecimal(51.98), Some(51)),
          BuyPrice(3, BigDecimal(51.98), Some(51)),
          BuyPrice(2, BigDecimal(51.98), Some(51))
        )
      }
    }
  }
}
