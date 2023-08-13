package ebayapp.core.clients.frasers

import cats.effect.IO
import ebayapp.core.MockConfigProvider
import ebayapp.core.MockLogger.given
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria}
import ebayapp.kernel.SttpClientSpec
import sttp.client3.{Response, SttpBackend}

class FrasersClientSpec extends SttpClientSpec {

  "FrasersClient for flannels" should {
    val flannelsConfig = GenericRetailerConfig("http://frasers.com", Map.empty)
    val config         = MockConfigProvider.make[IO](flannelsConfig = Some(flannelsConfig))

    val sc = SearchCriteria("stone island", Some("Mens"))

    "return stream of items based on provided search criteria" in {
      val args = Map(
        "categoryId"      -> "FLAN_TMSTONEISLAND",
        "sortOption"      -> "discountvalue_desc",
        "selectedFilters" -> "AFLOR^Mens"
      )
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.hasParams(args + ("page" -> "1")) => Response.ok(json("flannels/search-page1.json"))
          case r if r.isGet && r.hasParams(args + ("page" -> "2")) => Response.ok(json("flannels/search-page2.json"))
          case r if r.isGet && r.hasParams(args + ("page" -> "3")) => Response.ok(json("flannels/search-page3.json"))
          case r                                                   => throw new RuntimeException(r.uri.toString)
        }

      FrasersClient
        .flannels[IO](config, testingBackend)
        .flatMap(_.search(sc).compile.toList)
        .asserting { items =>
          items must have size 17
          items.map(_.listingDetails.seller).toSet mustBe Set("Flannels")

          val item = items.head

          item.itemDetails mustBe Clothing("Garment Dyed Leather Gilet (Olive)", "Stone Island", "M")
          item.buyPrice mustBe BuyPrice(1, 899.00, Some(69))
        }
    }
  }

  "FrasersClient for tessuti" should {
    val tessutiConfig = GenericRetailerConfig("http://frasers.com", Map.empty)
    val config        = MockConfigProvider.make[IO](tessutiConfig = Some(tessutiConfig))

    val sc = SearchCriteria("emporio armani", Some("MENS"))

    "return stream of items based on provided search criteria" in {
      val args = Map(
        "categoryId"      -> "TESS_BRAEMPORIOARMANI",
        "selectedFilters" -> "390_4098650^Mens",
        "sortOption"      -> "discountvalue_desc"
      )
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.hasParams(args + ("page" -> "1")) => Response.ok(json("flannels/search-page1.json"))
          case r if r.isGet && r.hasParams(args + ("page" -> "2")) => Response.ok(json("flannels/search-page2.json"))
          case r if r.isGet && r.hasParams(args + ("page" -> "3")) => Response.ok(json("flannels/search-page3.json"))
          case r                                                   => throw new RuntimeException(r.uri.toString)
        }

      FrasersClient
        .tessuti[IO](config, testingBackend)
        .flatMap(_.search(sc).compile.toList)
        .asserting(_ must have size 17)
    }
  }

  "FrasersClient for scotts" should {
    val scottsConfig = GenericRetailerConfig("http://frasers.com", Map.empty)
    val config       = MockConfigProvider.make[IO](scottsConfig = Some(scottsConfig))

    val sc = SearchCriteria("hugo", Some("mens"))

    "return stream of items based on provided search criteria" in {
      val args = Map(
        "categoryId"      -> "SCOT_BRAHUGO",
        "selectedFilters" -> "390_4098464^Mens",
        "sortOption"      -> "discountvalue_desc"
      )
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.hasParams(args + ("page" -> "1")) => Response.ok(json("flannels/search-page1.json"))
          case r if r.isGet && r.hasParams(args + ("page" -> "2")) => Response.ok(json("flannels/search-page2.json"))
          case r if r.isGet && r.hasParams(args + ("page" -> "3")) => Response.ok(json("flannels/search-page3.json"))
          case r                                                   => throw new RuntimeException(r.uri.toString)
        }

      FrasersClient
        .scotts[IO](config, testingBackend)
        .flatMap(_.search(sc).compile.toList)
        .asserting(_ must have size 17)
    }
  }
}
