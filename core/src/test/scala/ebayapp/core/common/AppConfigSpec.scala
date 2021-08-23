package ebayapp.core.common

import ebayapp.core.CatsSpec
import ebayapp.core.clients.Retailer
import ebayapp.core.common.config.AppConfig

class AppConfigSpec extends CatsSpec {
  "An AppConfig" should {

    "load itself from application.conf file" in {
      val conf = AppConfig.loadDefault

      conf.mongo.dbName mustBe "ebay-app"
      conf.server.host mustBe "0.0.0.0"
      conf.cex.baseUri mustBe "https://wss2.cex.uk.webuy.io"
      conf.selfridges.headers mustBe Map("api-key" -> "key")
      conf.nvidia.proxied mustBe true

      conf.stockMonitor must contain key Retailer.Nvidia
      conf.dealsFinder must contain key Retailer.Ebay
    }
  }
}
