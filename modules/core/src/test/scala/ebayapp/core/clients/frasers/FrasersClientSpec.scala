package ebayapp.core.clients.frasers

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

class FrasersClientSpec extends IOWordSpec {

  "FrasersClient for flannels" should {
    val flannelsConfig = GenericRetailerConfig("http://frasers.com", Map.empty)
    val config         = MockRetailConfigProvider.make[IO](flannelsConfig = Some(flannelsConfig))
    val sc             = SearchCriteria("stone island", Some("Mens"))

    "return stream of items based on provided search criteria" in {
      val client = mock[CurlImpersonateClient[IO]]
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=FLAN_BRASTONEISLAND&page=1&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=AFLOR%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-page1.json")))
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=FLAN_BRASTONEISLAND&page=2&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=AFLOR%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-page2.json")))
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=FLAN_BRASTONEISLAND&page=3&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=AFLOR%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-no-results.json")))

      FrasersClient
        .flannels[IO](config, client)
        .flatMap(_.search(sc).compile.toList)
        .asserting { items =>
          items must have size 17
          items.map(_.listingDetails.seller).toSet mustBe Set("Flannels")

          val item = items.head

          item.itemDetails mustBe Clothing("Garment Dyed Leather Gilet (Olive)", "Stone Island", "M")
          item.buyPrice mustBe BuyPrice(1, 899.00, Some(69))
        }
    }

    "parse updated response" in {
      val client = mock[CurlImpersonateClient[IO]]
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=FLAN_BRASTONEISLAND&page=1&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=AFLOR%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/new-page1.json")))
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=FLAN_BRASTONEISLAND&page=2&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=AFLOR%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-no-results.json")))

      FrasersClient
        .flannels[IO](config, client)
        .flatMap(_.search(sc).compile.toList)
        .asserting { items =>
          items must have size 323
        }
    }
  }
}
