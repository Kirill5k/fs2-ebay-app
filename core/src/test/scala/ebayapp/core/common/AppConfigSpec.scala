package ebayapp.core.common

import config.{AppConfig, DealsFinderConfig, DealsFinderRequest, SearchCriteria}
import ebayapp.core.CatsSpec
import ebayapp.core.domain.ItemKind.VideoGame

import scala.concurrent.duration._

class AppConfigSpec extends CatsSpec {
  "An AppConfig" should {

    "load itself from application.conf file" in {
      val conf = AppConfig.loadDefault

      conf.mongo.dbName mustBe "ebay-app"
      conf.server.host mustBe "0.0.0.0"
      conf.cex.baseUri mustBe "https://wss2.cex.uk.webuy.io"
      conf.ebay.dealsFinder mustBe DealsFinderConfig(60.seconds, List(DealsFinderRequest(SearchCriteria("PS4", itemKind = Some(VideoGame)), 25, Some(10))))
      conf.selfridges.headers mustBe Map("api-key" -> "key")
      conf.nvidia.proxied mustBe true
    }
  }
}
