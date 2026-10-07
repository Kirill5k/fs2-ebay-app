package ebayapp.core.clients.cex

import ebayapp.core.clients.cex.responses.CexGraphqlItem
import io.circe.Json
import io.circe.syntax.*
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class CexResponsesSpec extends AnyWordSpec with Matchers {

  private def itemJson(categoryId: Json): Json = Json.obj(
    "boxId"                   -> Json.fromString("item-1"),
    "boxName"                 -> Json.fromString("Game"),
    "categoryId"              -> categoryId,
    "categoryFriendlyName"    -> Json.fromString("Games"),
    "exchangePerc"            -> Json.fromInt(0),
    "sellPrice"               -> Json.fromInt(10),
    "cashPriceCalculated"     -> Json.fromInt(5),
    "exchangePriceCalculated" -> Json.fromInt(7),
    "webBuyAllowed"           -> Json.fromInt(1)
  )

  "CexGraphqlItem" should {
    "preserve string category IDs" in {
      itemJson(Json.fromString("01000")).as[CexGraphqlItem].map(_.categoryId) mustBe Right("01000")
    }

    "decode integer category IDs as strings" in {
      itemJson(Json.fromInt(1000)).as[CexGraphqlItem].map(_.categoryId) mustBe Right("1000")
    }

    "encode category IDs as strings" in {
      val encoded = itemJson(Json.fromInt(1000)).as[CexGraphqlItem].map(_.asJson.hcursor.get[String]("categoryId"))

      encoded mustBe Right(Right("1000"))
    }

    "reject invalid category IDs" in {
      List(Json.Null, Json.True, Json.fromBigDecimal(BigDecimal("1000.5")), Json.arr(), Json.obj()).foreach { categoryId =>
        itemJson(categoryId).as[CexGraphqlItem].isLeft mustBe true
      }
      itemJson(Json.fromInt(1000)).mapObject(_.remove("categoryId")).as[CexGraphqlItem].isLeft mustBe true
    }

    "require other string fields to remain strings" in {
      itemJson(Json.fromInt(1000)).mapObject(_.add("boxId", Json.fromInt(1))).as[CexGraphqlItem].isLeft mustBe true
    }
  }
}
