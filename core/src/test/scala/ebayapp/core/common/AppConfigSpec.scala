package ebayapp.core.common

import config.{AppConfig, SearchQuery}
import ebayapp.core.CatsSpec

class AppConfigSpec extends CatsSpec {
  "An AppConfig" should {

    "load itself from application.conf file" in {
      val conf = AppConfig.loadDefault

      conf.server.host mustBe "0.0.0.0"
      conf.cex.baseUri mustBe "https://wss2.cex.uk.webuy.io"
      conf.ebay.deals.videoGames.searchQueries mustBe List(SearchQuery("XBOX ONE"), SearchQuery("PS4"))
    }
  }
}
