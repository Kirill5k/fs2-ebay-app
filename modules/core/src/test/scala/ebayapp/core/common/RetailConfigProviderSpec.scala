package ebayapp.core.common

import cats.effect.IO
import ebayapp.core.MockLogger
import ebayapp.core.common.config.{GenericRetailerConfig, RetailConfig, StockMonitorConfig}
import ebayapp.core.domain.Retailer
import ebayapp.core.repositories.RetailConfigRepository
import kirill5k.common.cats.test.IOWordSpec
import pureconfig.ConfigSource
import fs2.Stream

import scala.concurrent.duration.*

class RetailConfigProviderSpec extends IOWordSpec {
  given logger: Logger[IO] = MockLogger.make[IO]

  val retailConfig = ConfigSource.default.loadOrThrow[RetailConfig]

  "A RetailConfigProvider" when {
    "cex" should {
      "return latest cex config" in {
        val repo = mock[RetailConfigRepository[IO]]
        when(repo.get).thenReturnIO(Some(retailConfig))
        when(repo.updates).thenReturn(Stream.empty)

        val result = for
          rcp    <- RetailConfigProvider.mongoV2[IO](repo)
          config <- rcp.cex
        yield config

        result.asserting(_ mustBe retailConfig.retailer.cex)
      }

      "return updated config when changes received" in {
        val updatedCexConfig = retailConfig.retailer.cex.copy(
          baseUri = "foo",
          headers = Map("foo" -> "bar")
        )

        val repo = mock[RetailConfigRepository[IO]]
        when(repo.get).thenReturnIO(Some(retailConfig))
        when(repo.updates).thenReturn(Stream[IO, RetailConfig](retailConfig.withCexConfig(updatedCexConfig)).delayBy(500.millis))

        val result = for
          rcp    <- RetailConfigProvider.mongoV2[IO](repo)
          _      <- IO.sleep(1.second)
          config <- rcp.cex
        yield config

        result.asserting(_ mustBe updatedCexConfig)
      }
    }

    "stockMonitor" should {
      "stream latest stock monitor configs for a retailer" in {
        val repo = mock[RetailConfigRepository[IO]]
        when(repo.get).thenReturnIO(Some(retailConfig))
        when(repo.updates).thenReturn(Stream.empty)

        val result = for
          rcp      <- RetailConfigProvider.mongoV2[IO](repo)
          cexSM    <- rcp.stockMonitor(Retailer.Cex).take(1).compile.toList
          nvidiaSM <- rcp.stockMonitor(Retailer.Nvidia).take(1).compile.toList
        yield (cexSM.headOption, nvidiaSM.headOption)

        result.asserting { res =>
          res mustBe (retailConfig.stockMonitor.get(Retailer.Cex), retailConfig.stockMonitor.get(Retailer.Nvidia))
        }
      }

      "stream stock monitor config updates for a retailer" in {
        val updatedCexStockMonitor = retailConfig
          .stockMonitor(Retailer.Cex)
          .copy(
            monitoringRequests = Nil,
            monitoringFrequency = 1.minute
          )

        val updatedRetailConfig = retailConfig.withStockMonitorConfig(Retailer.Cex, updatedCexStockMonitor)

        val repo = mock[RetailConfigRepository[IO]]
        when(repo.get).thenReturnIO(Some(retailConfig))
        when(repo.updates).thenReturn(Stream[IO, RetailConfig](updatedRetailConfig).delayBy(500.millis))

        val result = for
          rcp           <- RetailConfigProvider.mongoV2[IO](repo)
          nvidiaSMFiber <- rcp.stockMonitor(Retailer.Nvidia).interruptAfter(1.seconds).compile.toList.start
          cexSM         <- rcp.stockMonitor(Retailer.Cex).interruptAfter(1.seconds).compile.toList
          nvidiaSM      <- nvidiaSMFiber.join.flatMap(_.embed(IO.pure(Nil)))
        yield (cexSM.lastOption, nvidiaSM.lastOption)

        result.asserting { res =>
          res mustBe (Some(updatedCexStockMonitor), retailConfig.stockMonitor.get(Retailer.Nvidia))
        }
      }
    }
  }

  extension (rc: RetailConfig)
    def withCexConfig(cex: GenericRetailerConfig): RetailConfig =
      rc.copy(retailer = rc.retailer.copy(cex = cex))
    def withStockMonitorConfig(retailer: Retailer, config: StockMonitorConfig): RetailConfig =
      rc.copy(stockMonitor = rc.stockMonitor + (retailer -> config))
}
