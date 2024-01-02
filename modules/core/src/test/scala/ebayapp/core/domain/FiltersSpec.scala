package ebayapp.core.domain

import ebayapp.core.domain.search.{BuyPrice, Filters}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class FiltersSpec extends AnyWordSpec with Matchers {

  "Filters" should {

    "return true when there are no filters defined" in {
      val game = ResellableItemBuilder.makeVideoGame("super mario 3")

      Filters(minDiscount = None).apply(game) mustBe true
    }

    "return false when item has no full name" in {
      val game = ResellableItemBuilder.makeVideoGame("super mario 3", platform = None)

      Filters(minDiscount = None).apply(game) mustBe false
    }

    "return false when min discount is below limit" in {
      val game = ResellableItemBuilder.makeVideoGame("super mario 3", buyPrice = BuyPrice(1, BigDecimal(10), Some(10)))

      Filters(minDiscount = Some(50)).apply(game) mustBe false
    }

    "return false when item has excluded name" in {
      val game = ResellableItemBuilder.makeVideoGame("super mario 3")

      Filters(exclude = Some(List("mario 3"))).apply(game) mustBe false
    }

    "return false when item doesn't match include filter" in {
      val game = ResellableItemBuilder.makeVideoGame("super mario 3")

      Filters(include = Some(List("mario 2"))).apply(game) mustBe false
    }

    "return false when item has excluded name and include filter is present" in {
      val game = ResellableItemBuilder.makeVideoGame("super mario 3")

      Filters(exclude = Some(List("super")), include = Some(List("mario 3"))).apply(game) mustBe false
    }

    "use higher min discount when merging 2 filters together" in {
      val f1 = Filters(minDiscount = Some(10))
      val f2 = Filters(minDiscount = Some(15))

      f1.mergeWith(f2).minDiscount mustBe Some(15)
    }

    "use lower max price when merging 2 filters together" in {
      val f1 = Filters(maxPrice = Some(100))
      val f2 = Filters(maxPrice = Some(150))

      f1.mergeWith(f2).maxPrice mustBe Some(100)
    }

    "merge 2 include filters together" in {
      val f1 = Filters(include = Some(List("foo")))
      val f2 = Filters(include = Some(List("bar")))

      f1.mergeWith(f2).include mustBe Some(List("foo", "bar"))
    }
  }
}
