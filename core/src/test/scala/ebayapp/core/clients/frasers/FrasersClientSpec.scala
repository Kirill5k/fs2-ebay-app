package ebayapp.core.clients.frasers

import cats.effect.IO
import ebayapp.core.{MockConfigProvider, MockLogger}
import ebayapp.core.common.Logger
import ebayapp.core.common.config.GenericRetailerConfig
import ebayapp.core.domain.ItemDetails.Clothing
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria}
import ebayapp.kernel.SttpClientSpec
import sttp.client3.{Response, SttpBackend}

class FrasersClientSpec extends SttpClientSpec {

  given logger: Logger[IO] = MockLogger.make[IO]

  val flannelsConfig = GenericRetailerConfig("http://frasers.com", Map.empty)
  val config         = MockConfigProvider.make[IO](flannelsConfig = Some(flannelsConfig))

  "FrasersClient for flannels" should {
    val sc = SearchCriteria("stone island", Some("men"))

    "return stream of items based on provided search criteria" in {
      val args = Map("categoryId" -> "FLAN_TMSTONEISLAND", "pathName" -> "/stone-island/men", "sortOption" -> "discountvalue_desc")
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
          val item = items.head

          item.itemDetails mustBe Clothing("Garment Dyed Leather Gilet (Olive)", "STONE ISLAND", "M")
          item.buyPrice mustBe BuyPrice(1, 899.00, Some(69))
        }
    }
  }

  "FrasersClient for tessuti" should {
    val sc = SearchCriteria("emporio armani", Some("men"))

    "return stream of items based on provided search criteria" in {
      val args = Map("categoryId" -> "TESS_BRAEMPORIOARMANI", "pathName" -> "/emporio-armani/men", "sortOption" -> "discountvalue_desc")
      val testingBackend: SttpBackend[IO, Any] = backendStub
        .whenRequestMatchesPartial {
          case r if r.isGet && r.hasParams(args + ("page" -> "1")) => Response.ok(json("flannels/search-page1.json"))
          case r if r.isGet && r.hasParams(args + ("page" -> "2")) => Response.ok(json("flannels/search-page2.json"))
          case r if r.isGet && r.hasParams(args + ("page" -> "3")) => Response.ok(json("flannels/search-page3.json"))
          case r => throw new RuntimeException(r.uri.toString)
        }

      FrasersClient
        .tessuti[IO](config, testingBackend)
        .flatMap(_.search(sc).compile.toList)
        .asserting(_ must have size 17)
    }
  }
}
