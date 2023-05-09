package ebayapp.kernel.syntax

import ebayapp.kernel.syntax.time.*

import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.concurrent.duration.*

class TimeSpec extends AnyWordSpec with Matchers {

  "A FiniteDuration extension" should {

    "convert fd to readable string" in {
      100.millis.toReadableString mustBe "0s"
      30.minutes.toReadableString mustBe "30m"
      60.minutes.toReadableString mustBe "1h"
      90.minutes.toReadableString mustBe "1h30m"
      27.hours.toReadableString mustBe "1d3h"
    }
  }

}