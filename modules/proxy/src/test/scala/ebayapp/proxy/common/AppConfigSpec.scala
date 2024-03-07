package ebayapp.proxy.common

import cats.effect.IO
import kirill5k.common.cats.test.IOWordSpec
import ebayapp.proxy.common.config.AppConfig

import scala.concurrent.duration.*

class AppConfigSpec extends IOWordSpec {

  "An AppConfig" should {
    "load from application.conf" in {
      AppConfig.load[IO].asserting { conf =>
        conf.server.host mustBe "0.0.0.0"
        conf.client.proxyHost mustBe Some("my.proxy.com")
        conf.interrupter.initialDelay mustBe 30.minutes
      }
    }
  }
}
