package ebayapp.core.common

import cats.effect.{Blocker, IO}
import config.{AppConfig, SearchQuery}
import ebayapp.core.CatsSpec

class AppConfigSpec extends CatsSpec {
  "An AppConfig" should {

    "load itself from application.conf file" in {
      Blocker[IO].use(AppConfig.load[IO]).unsafeToFuture().map { conf =>
        conf.server.host mustBe "0.0.0.0"
        conf.cex.baseUri mustBe "https://wss2.cex.uk.webuy.io"
        conf.ebay.deals.videoGames.searchQueries must be(List(SearchQuery("XBOX ONE"), SearchQuery("PS4")))
      }
    }
  }
}