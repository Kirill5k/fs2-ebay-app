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

  "FrasersClient for tessuti" should {
    val tessutiConfig = GenericRetailerConfig("http://frasers.com", Map.empty)
    val config        = MockRetailConfigProvider.make[IO](tessutiConfig = Some(tessutiConfig))
    val sc            = SearchCriteria("emporio armani", Some("MENS"))

    "return stream of items based on provided search criteria" in {
      val client = mock[CurlImpersonateClient[IO]]
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=TESS_BRAEMPORIOARMANI&page=1&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=390_4098650%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-page1.json")))
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=TESS_BRAEMPORIOARMANI&page=2&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=390_4098650%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-page2.json")))
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=TESS_BRAEMPORIOARMANI&page=3&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=390_4098650%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-no-results.json")))

      FrasersClient
        .tessuti[IO](config, client)
        .flatMap(_.search(sc).compile.toList)
        .asserting(_ must have size 17)
    }
  }

  "FrasersClient for scotts" should {
    val scottsConfig = GenericRetailerConfig("http://frasers.com", Map.empty)
    val config       = MockRetailConfigProvider.make[IO](scottsConfig = Some(scottsConfig))
    val sc           = SearchCriteria("hugo", Some("mens"))

    "return stream of items based on provided search criteria" in {
      val client = mock[CurlImpersonateClient[IO]]
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=SCOT_BRAHUGO&page=1&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=390_4098464%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-page1.json")))
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=SCOT_BRAHUGO&page=2&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=390_4098464%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-page2.json")))
      when(client.get(
        eqTo("http://frasers.com/api/productlist/v1/getforcategory?categoryId=SCOT_BRAHUGO&page=3&productsPerPage=100&sortOption=discountvalue_desc&isSearch=false&clearFilters=false&selectedCurrency=GBP&selectedFilters=390_4098464%5EMens"),
        any[Map[String, String]],
        any
      )).thenReturnIO((StatusCode.Ok, FileReader.fromResources("flannels/search-no-results.json")))

      FrasersClient
        .scotts[IO](config, client)
        .flatMap(_.search(sc).compile.toList)
        .asserting(_ must have size 17)
    }
  }
}
