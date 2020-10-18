package io.github.kirill5k.ebayapp.common

import cats.effect.{Blocker, IO}
import io.github.kirill5k.ebayapp.common.config.AppConfig

class AppConfigSpec extends CatsSpec {
  "An AppConfig" should {

    "load itself from application.conf file" in {
      Blocker[IO].use(AppConfig.load[IO]).unsafeToFuture().map { conf =>
        conf.server.host mustBe "0.0.0.0"
        conf.cex.baseUri mustBe "https://wss2.cex.uk.webuy.io"
      }
    }
  }
}
