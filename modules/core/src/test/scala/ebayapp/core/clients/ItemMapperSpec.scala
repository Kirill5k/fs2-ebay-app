package ebayapp.core.clients

import ebayapp.core.domain.{search, ResellableItem}
import org.scalatest.Inspectors
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ItemMapperSpec extends AnyWordSpec with Matchers with Inspectors {

  "ItemMapper" should {

    val itemMapper = new ItemMapper[String] {
      override def toDomain(foundWith: search.SearchCriteria)(clientItem: String): ResellableItem = ???
    }

    import itemMapper.*

    "map sizes" in {
      val sizeMappings = Map(
        "EUR 45 / 11 UK MEN" -> "11",
        "Medium"             -> "M",
        "9 (43)"             -> "9",
        "UK42(EU52)"         -> "UK42",
        "54(64)"             -> "54",
        "46 (S)"             -> "S",
        "9.5 (43.5)"         -> "9.5",
        "80 (8 S)"           -> "8 S",
        "UK52"               -> "UK52",
        "S (58)"             -> "S",
        "size"               -> "ONE SIZE",
        "X S"                -> "XS",
        "XXS"                -> "2XS",
        "XXXXL"              -> "4XL",
        "30W R"              -> "30R"
      )

      forAll(sizeMappings) { (size, exp) =>
        formatSize(size) mustBe exp
      }
    }

    "capitalise strings" in {
      val strings = List("harvey-nichols", "selfridges", "EMPORIO ARMANI EA7")

      strings.map(_.capitalizeAll) mustBe List("Harvey Nichols", "Selfridges", "Emporio Armani EA7")
    }

    "replace ampersand" in {
      val strings = List("Dolce and Gabbana")

      strings.map(_.capitalizeAll) mustBe List("Dolce & Gabbana")
    }
  }
}
