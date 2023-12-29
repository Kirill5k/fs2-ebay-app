package ebayapp.core.services

import ebayapp.core.domain.ResellableItemBuilder
import ebayapp.core.domain.Notification
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ResellableItemOpsSpec extends AnyWordSpec with Matchers {

  import NotificationService.*

  "A VideoGame" should {
    "return cheap item notification message string" in {
      val game  = ResellableItemBuilder.videoGame("super mario 3", platform = Some("SWITCH"))
      val query = game.cheapItemNotification
      val msg   = """NEW "super mario 3 SWITCH" - ebay: £32.99, cex: £80(142%)/£100 (qty: 1) https://www.ebay.co.uk/itm/super-mario-3"""
      query mustBe Some(Notification.Deal(msg))
    }

    "return none if some of the item details are missing" in {
      val game  = ResellableItemBuilder.videoGame("super mario 3", platform = None)
      val query = game.cheapItemNotification
      query mustBe None
    }

    "return none if resell price is missing" in {
      val game  = ResellableItemBuilder.videoGame("super mario 3", sellPrice = None)
      val query = game.cheapItemNotification
      query mustBe None
    }
  }
}
