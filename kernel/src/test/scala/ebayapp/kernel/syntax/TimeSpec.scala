package ebayapp.kernel.syntax

import ebayapp.kernel.syntax.time.*
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import java.time.{Instant, LocalDate}
import scala.concurrent.duration.*

class TimeSpec extends AnyWordSpec with Matchers {

  val ts = Instant.parse("2020-01-01T00:00:00Z")

  "A String extension" should {
    "convert str to instant" in {
      "2020-01-01".toInstant mustBe Right(ts)
      "2020-01-01T00:00:00".toInstant mustBe Right(ts)
      "2020-01-01T00:00:00Z".toInstant mustBe Right(ts)
      "foo".toInstant.left.map(_.getMessage) mustBe Left("Text 'foo' could not be parsed at index 0")
    }
  }

  "A FiniteDuration extension" should {
    "convert fd to readable string" in {
      100.millis.toReadableString mustBe "0s"
      30.minutes.toReadableString mustBe "30m"
      60.minutes.toReadableString mustBe "1h"
      90.minutes.toReadableString mustBe "1h30m"
      27.hours.toReadableString mustBe "1d3h"
    }
  }

  "An Instant extension" should {
    "return duration between 2 instances" in {
      ts.durationBetween(ts.plusSeconds(3600L)) mustBe 1.hour
    }
  }

}
