package ebayapp.proxy.common

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.proxy.common.config.AppConfig
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers

class AppConfigSpec extends AsyncWordSpec with Matchers {

  given rt: IORuntime      = IORuntime.global

  "An AppConfig" should {
    "load from application.conf" in {
      val conf = AppConfig.load[IO]

      conf.unsafeToFuture().map(_.server.host mustBe "0.0.0.0")
    }
  }
}
