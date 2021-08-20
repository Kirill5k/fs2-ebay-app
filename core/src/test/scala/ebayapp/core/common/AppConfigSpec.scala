package ebayapp.core.common

import config.{AppConfig, SearchCriteria}
import ebayapp.core.CatsSpec

class AppConfigSpec extends CatsSpec {
  "An AppConfig" should {

    "load itself from application.conf file" in {
      val conf = AppConfig.loadDefault

      conf.mongo.dbName mustBe "ebay-app"
      conf.server.host mustBe "0.0.0.0"
      conf.cex.baseUri mustBe "https://wss2.cex.uk.webuy.io"
      conf.ebay.deals.videoGames.searchCriteria mustBe List(SearchCriteria("XBOX ONE"), SearchCriteria("PS4"))
      conf.selfridges.headers mustBe Map("api-key" -> "key")
      conf.nvidia.proxied mustBe true
    }
  }
}
