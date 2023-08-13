package ebayapp.proxy.common

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.proxy.common.config.AppConfig
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers

import scala.concurrent.duration.*

class AppConfigSpec extends AsyncWordSpec with Matchers {

  given rt: IORuntime = IORuntime.global

  "An AppConfig" should {
    "load from application.conf" in {
      AppConfig.load[IO].unsafeToFuture().map { conf =>
        conf.server.host mustBe "0.0.0.0"
        conf.client.proxyHost mustBe Some("my.proxy.com")
        conf.interrupter.initialDelay mustBe 30.minutes
      }
    }
  }
}
