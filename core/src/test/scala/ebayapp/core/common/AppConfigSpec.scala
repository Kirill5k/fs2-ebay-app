package ebayapp.core.common

import config.{AppConfig, DealsFinderConfig, DealsFinderRequest}
import ebayapp.core.CatsSpec
import ebayapp.core.clients.{Retailer, SearchCriteria}
import ebayapp.core.domain.ItemKind.VideoGame

import scala.concurrent.duration._

class AppConfigSpec extends CatsSpec {
  "An AppConfig" should {

    "load itself from application.conf file" in {
      val conf = AppConfig.loadDefault

      conf.mongo.dbName mustBe "ebay-app"
      conf.server.host mustBe "0.0.0.0"
      conf.cex.baseUri mustBe "https://wss2.cex.uk.webuy.io"
      val ebayDeals = List(DealsFinderRequest(SearchCriteria("PS4", itemKind = Some(VideoGame)), 25, Some(10)))
      conf.ebay.dealsFinder mustBe DealsFinderConfig(60.seconds, ebayDeals, 10.seconds)
      conf.selfridges.headers mustBe Map("api-key" -> "key")
      conf.nvidia.proxied mustBe true

      conf.stockMonitor must contain key Retailer.Nvidia
      conf.dealsFinder must contain key Retailer.Ebay
    }
  }
}
