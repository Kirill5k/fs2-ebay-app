package ebayapp.core.domain

import ebayapp.core.domain.search.{BuyPrice, Filters}
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class FiltersSpec extends AnyWordSpec with Matchers {

  "Filters" should {

    "return true when there are no filters defined" in {
      val game = ResellableItemBuilder.videoGame("super mario 3")

      Filters(minDiscount = None).apply(game) mustBe true
    }

    "return false when item has no full name" in {
      val game = ResellableItemBuilder.videoGame("super mario 3", platform = None)

      Filters(minDiscount = None).apply(game) mustBe false
    }

    "return false when item has excluded name" in {
      val game = ResellableItemBuilder.videoGame("super mario 3")

      Filters(exclude = Some(List("mario 3"))).apply(game) mustBe false
    }

    "return false when min discount is below limit" in {
      val game = ResellableItemBuilder.videoGame("super mario 3", buyPrice = BuyPrice(1, BigDecimal(10), Some(10)))

      Filters(minDiscount = Some(50)).apply(game) mustBe false
    }

    "return true when include filter is present" in {
      val game = ResellableItemBuilder.videoGame("super mario 3")

      Filters(exclude = Some(List("mario 3")), include = Some(List("mario 3"))).apply(game) mustBe true
    }
  }
}
