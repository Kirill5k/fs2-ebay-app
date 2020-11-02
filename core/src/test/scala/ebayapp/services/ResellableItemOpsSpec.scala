package ebayapp.services

import ebayapp.domain.ResellableItemBuilder
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ResellableItemOpsSpec extends AnyWordSpec with Matchers {

  import NotificationService._

  "A VideoGame" should {
    "return cheap item notification message string" in {
      val game = ResellableItemBuilder.videoGame("super mario 3", platform = Some("SWITCH"))
      val query = game.cheapItemNotification
      query must be (Some("""NEW "super mario 3 SWITCH" - ebay: £32.99, cex: £80(142%)/£100 (available: 1) https://www.ebay.co.uk/itm/super-mario-3"""))
    }

    "return none if some of the item details are missing" in {
      val game = ResellableItemBuilder.videoGame("super mario 3", platform = None)
      val query = game.cheapItemNotification
      query must be (None)
    }

    "return none if resell price is missing" in {
      val game = ResellableItemBuilder.videoGame("super mario 3", resellPrice = None)
      val query = game.cheapItemNotification
      query must be (None)
    }
  }
}
