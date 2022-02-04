package ebayapp.core.services

import ebayapp.core.domain.ResellableItemBuilder
import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.must.Matchers
import java.time.Instant

class StockComparerSpec extends AnyWordSpec with Matchers {

  "A StockComparer" when {
    "mergeItems" should {
      "keep the current if it has the same key as previous" in {
        val prevItem = ResellableItemBuilder.generic("Apple MacBook Pro Silver/A", quantity = 2)
        val currItem = ResellableItemBuilder.generic("Apple MacBook Pro Silver/A", quantity = 1)

        val res = StockComparer.mergeItems(Map("mb-pro" -> prevItem), Map("mb-pro" -> currItem))

        res mustBe Map("mb-pro" -> currItem)
      }

      "keep the current if there is no previous" in {
        val currItem = ResellableItemBuilder.generic("Apple MacBook Pro Silver/A", quantity = 1)

        val res = StockComparer.mergeItems(Map.empty, Map("mb-pro" -> currItem))

        res mustBe Map("mb-pro" -> currItem)
      }

      "keep the prev if it isn't too old" in {
        val prevItem = ResellableItemBuilder.generic("Apple MacBook Pro Silver/A", quantity = 1)

        val res = StockComparer.mergeItems(Map("mb-pro" -> prevItem), Map.empty)

        res mustBe Map("mb-pro" -> prevItem)
      }

      "remove the prev if it is too old" in {
        val prevItem = ResellableItemBuilder.generic("Apple MacBook Pro Silver/A", datePosted = Instant.parse("2020-01-01T00:00:00Z"))

        val res = StockComparer.mergeItems(Map("mb-pro" -> prevItem), Map.empty)

        res mustBe Map.empty
      }
    }
  }
}
