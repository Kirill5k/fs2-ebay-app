package ebayapp.core.common

import ebayapp.core.CatsSpec
import ebayapp.core.clients.{Retailer, SearchCriteria}
import ebayapp.core.common.config.{AppConfig, StockMonitorConfig, StockMonitorRequest}

import scala.concurrent.duration.*

class AppConfigSpec extends CatsSpec {
  "An AppConfig" should {

    "load itself from application.conf file" in {
      val conf = AppConfig.loadDefault

      conf.mongo.dbName mustBe "ebay-app"
      conf.server.host mustBe "0.0.0.0"
      conf.cex.baseUri mustBe "https://wss2.cex.uk.webuy.io"
      conf.selfridges.headers mustBe Map("api-key" -> "key")
      conf.nvidia.proxied mustBe Some(true)
      conf.harveyNichols.baseUri mustBe "https://www.harveynichols.com"

      val geforceMonReq = StockMonitorRequest(SearchCriteria("geforce", Some("GPU"), excludeFilters = Some(List("GTX 1650"))), true, true)
      conf.stockMonitor must contain (Retailer.Nvidia -> StockMonitorConfig(5.minutes, List(geforceMonReq)))
      conf.stockMonitor must contain key Retailer.HarveyNichols
      conf.dealsFinder must contain key Retailer.Ebay
    }
  }
}
