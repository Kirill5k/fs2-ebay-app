package ebayapp.core.domain

import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import io.circe.syntax.*
import io.circe.parser.*

class ItemKindSpec extends AnyWordSpec with Matchers {

  "An ItemKind json serialiser" should {

    "serialise ItemKind to json string" in {

      ItemKind.values.map(_.asJson.noSpaces).toSet mustBe Set("\"generic\"", "\"video-game\"", "\"mobile-phone\"", "\"clothing\"")
    }

    "deserialise json string to ItemKind" in {
      val strings = List("\"generic\"", "\"video-game\"", "\"mobile-phone\"", "\"clothing\"")

      strings.flatMap(decode[ItemKind](_).toOption) mustBe ItemKind.values
    }
  }
}
