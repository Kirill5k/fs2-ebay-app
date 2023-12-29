package ebayapp.core.domain

import io.circe.syntax.*
import io.circe.parser.*
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ItemDetailsSpec extends AnyWordSpec with Matchers {

  "A VideoGame" should {
    val game = ResellableItemBuilder.videoGame("super mario 3", platform = Some("SWITCH"))

    "return search query string" in {
      val query = game.itemDetails.fullName
      query mustBe Some("super mario 3 SWITCH")
    }

    "return none is some of the parameters are missing" in {
      val query = game.itemDetails.asInstanceOf[ItemDetails.VideoGame].copy(platform = None).fullName
      query mustBe None
    }

    "have codecs for json marshalling" in {
      val json: String      = """{"kind":"video-game","name":"super mario 3","platform":"SWITCH","releaseYear":null,"genre":null}"""
      val game: ItemDetails = ItemDetails.VideoGame(Some("super mario 3"), Some("SWITCH"), None, None)

      decode[ItemDetails](json) mustBe Right(game)
      game.asJson.noSpaces mustBe json
    }
  }

  "A MobilePhone" should {
    "return search query string" in {
      val phone = ResellableItemBuilder.mobilePhone("apple", "iphone 6", "Space Grey")
      val query = phone.itemDetails.fullName
      query mustBe Some("apple iphone 6 16GB Space Grey Unlocked")
    }

    "return none is some of the parameters are missing" in {
      val phone = ResellableItemBuilder.mobilePhone("apple", "iphone 6", "Space Grey")
      val query = phone.itemDetails.asInstanceOf[ItemDetails.Phone].copy(model = None).fullName
      query mustBe None
    }
  }
}
