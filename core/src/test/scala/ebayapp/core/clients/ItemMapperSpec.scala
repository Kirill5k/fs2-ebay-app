package ebayapp.core.clients

import ebayapp.core.domain.{ResellableItem, search}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ItemMapperSpec extends AnyWordSpec with Matchers {

  "ItemMapper" should {

    val itemMapper = new ItemMapper[String] {
      override def toDomain(foundWith: search.SearchCriteria)(clientItem: String): ResellableItem = ???
    }

    import itemMapper.*

    "map sizes" in {
      val sizes = List("Medium", "9 (43)", "UK42(EU52)", "54(64)", "46 (S)", "9.5 (43.5)", "80 (8 S)", "32W R", "UK52")

      sizes.map(formatSize) mustBe List("M", "9", "UK42", "54", "S", "9.5", "8 S", "32W R", "UK52")
    }

    "capitalise strings" in {
      val strings = List("harvey-nichols", "selfridges", "EMPORIO ARMANI EA7")

      strings.map(_.capitalizeAll) mustBe List("Harvey Nichols", "Selfridges", "Emporio Armani EA7")
    }
  }
}
