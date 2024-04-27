package ebayapp.core.common

import cats.effect.IO
import ebayapp.core.MockLogger
import ebayapp.core.common.config.{GenericRetailerConfig, RetailConfig}
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
  }

  extension (rc: RetailConfig)
    def withCexConfig(cex: GenericRetailerConfig): RetailConfig =
      rc.copy(retailer = rc.retailer.copy(cex = cex))
}
