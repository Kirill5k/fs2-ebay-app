package ebayapp.core.common

import cats.effect.IO
import kirill5k.common.cats.test.IOWordSpec
import ebayapp.core.common.config.{AppConfig, RetailConfig, StockMonitorConfig, StockMonitorRequest}
import ebayapp.core.domain.search.{Filters, SearchCriteria}
import ebayapp.core.domain.Retailer

import scala.collection.immutable.List
import scala.concurrent.duration.*

class AppConfigSpec extends IOWordSpec {
  "AppConfig" should {
    "load itself from application.conf file" in {
      AppConfig.loadDefault[IO].asserting { conf =>
        conf.mongo.dbName mustBe "ebay-app"
        conf.server.host mustBe "0.0.0.0"
      }
    }
  }

  "RetailConfig" should {
    "load itself from application.conf file" in {
      RetailConfig.loadDefault[IO].asserting { conf =>
        conf.retailer.cex.baseUri mustBe "https://wss2.cex.uk.webuy.io"
        conf.retailer.selfridges.headers mustBe Map(
          "X-Reroute-To"    -> "https://www.selfridges.com",
          "X-Reload-On-403" -> "true",
          "api-key"         -> "key"
        )
        conf.retailer.jdsports.delayBetweenIndividualRequests mustBe Some(2.seconds)

        val geforceFilters = Some(Filters(deny = Some(List("GTX 1650", "GTX 1660"))))
        val geforceMonReq  = StockMonitorRequest(SearchCriteria("geforce", Some("GPU")), true, true)
        conf.stockMonitor must contain(Retailer.Nvidia -> StockMonitorConfig(10.minutes, List(geforceMonReq), filters = geforceFilters))

        conf.stockMonitor must contain key Retailer.HarveyNichols
        conf.dealsFinder must contain key Retailer.Ebay
      }
    }
  }
}
