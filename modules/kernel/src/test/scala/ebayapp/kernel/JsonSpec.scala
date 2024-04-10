package ebayapp.kernel

import io.circe.Json
import io.circe.syntax.*
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import ebayapp.kernel.json.given
import org.scalatest.Inspectors

import scala.concurrent.duration.*

class JsonSpec extends AnyWordSpec with Matchers with Inspectors {

  "FiniteDuration codec" should {
    "convert json to finite duration" in {
      forAll(
        Map(
          "1minute"   -> 1.minute,
          "1 minute"  -> 1.minute,
          "2 minutes" -> 2.minute,
          "1m"        -> 1.minute,
          "1 m"       -> 1.minute,
          "500ms"     -> 500.millis
        )
      ) { (str, fd) =>
        Json.fromString(str).as[FiniteDuration] mustBe Right(fd)
      }
    }

    "handle errors for invalid jsons" in {
      forAll(
        Map(
          "foo"  -> "foo is not valid finite duration string. Expected format is '<length> <unit>'",
          "1foo" -> "1foo is not valid finite duration string. key not found: foo"
        )
      ) { (str, err) =>
        Json.fromString(str).as[FiniteDuration].left.map(_.getMessage) mustBe Left("DecodingFailure at : " + err)
      }
    }

    "convert finite duration to json" in {
      forAll(
        Map(
          1.minute   -> "1minute",
          2.minute   -> "2minutes",
          500.millis -> "500milliseconds"
        )
      ) { (fd, str) =>
        fd.asJson mustBe Json.fromString(str)
      }
    }
  }
}
