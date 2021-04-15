package ebayapp.core.domain

import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec

class ItemDetailsSpec extends AsyncWordSpec with Matchers {

  "A VideoGame" should {
    val game = ResellableItemBuilder.videoGame("super mario 3", platform = Some("SWITCH"))

    "return search query string" in {
      val query = game.itemDetails.fullName
      query must be (Some("super mario 3 SWITCH"))
    }

    "return none is some of the parameters are missing" in {
      val query = game.itemDetails.copy(platform = None).fullName
      query must be (None)
    }
  }

  "A MobilePhone" should {
    "return search query string" in {
      val phone = ResellableItemBuilder.mobilePhone("apple", "iphone 6", "Space Grey")
      val query = phone.itemDetails.fullName
      query must be (Some("apple iphone 6 16GB Space Grey Unlocked"))
    }

    "return none is some of the parameters are missing" in {
      val phone = ResellableItemBuilder.mobilePhone("apple", "iphone 6", "Space Grey")
      val query = phone.itemDetails.copy(model = None).fullName
      query must be (None)
    }
  }
}
