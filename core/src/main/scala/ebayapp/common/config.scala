package ebayapp.common

import java.nio.charset.StandardCharsets
import java.util.Base64

import pureconfig._
import pureconfig.generic.auto._
import pureconfig.module.catseffect.syntax._
import cats.effect.{Blocker, ContextShift, Sync}

import scala.concurrent.duration.FiniteDuration

object config {

  final case class MongoConfig(
      connectionUri: String
  )

  final case class ServerConfig(
      host: String,
      port: Int
  )

  final case class SearchQuery(value: String) extends AnyVal {
    def base64: String =
      Base64.getEncoder.encodeToString(value.replaceAll(" ", "").getBytes(StandardCharsets.UTF_8))
  }

  final case class EbayDealsConfig(
      searchFrequency: FiniteDuration,
      searchQueries: List[SearchQuery],
      maxListingDuration: FiniteDuration,
      minMarginPercentage: Int,
      maxExpectedQuantity: Int
  )

  final case class EbayDealsConfigs(
      videoGames: EbayDealsConfig
  )

  final case class EbayCredentials(
      clientId: String,
      clientSecret: String
  )

  final case class EbaySearchConfig(
      minFeedbackScore: Int,
      minFeedbackPercentage: Int
  )

  final case class EbayConfig(
      baseUri: String,
      credentials: List[EbayCredentials],
      search: EbaySearchConfig,
      deals: EbayDealsConfigs
  )

  final case class CexPriceFindConfig(
      cacheExpiration: FiniteDuration,
      cacheValidationPeriod: FiniteDuration
  )

  final case class StockMonitorRequest(
      query: SearchQuery,
      monitorStockChange: Boolean,
      monitorPriceChange: Boolean
  )

  final case class StockMonitorConfig(
      monitoringFrequency: FiniteDuration,
      monitoringRequests: List[StockMonitorRequest]
  )

  final case class CexConfig(
      baseUri: String,
      priceFind: CexPriceFindConfig,
      stockMonitor: StockMonitorConfig
  )

  final case class SelfridgesConfig(
      baseUri: String,
      apiKey: String,
      stockMonitor: StockMonitorConfig
  )

  final case class ArgosConfig(
      baseUri: String,
      stockMonitor: StockMonitorConfig
  )

  final case class TelegramConfig(
      baseUri: String,
      botKey: String,
      mainChannelId: String,
      secondaryChannelId: String,
      alertsChannelId: String
  )

  final case class AppConfig(
      server: ServerConfig,
      mongo: MongoConfig,
      cex: CexConfig,
      ebay: EbayConfig,
      selfridges: SelfridgesConfig,
      argos: ArgosConfig,
      telegram: TelegramConfig
  )

  object AppConfig {

    def load[F[_]: Sync: ContextShift](blocker: Blocker): F[AppConfig] =
      ConfigSource.default.loadF[F, AppConfig](blocker)
  }

}
