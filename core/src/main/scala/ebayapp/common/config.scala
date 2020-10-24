package ebayapp.common

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

  final case class SearchQuery(value: String) extends AnyVal

  final case class EbayDealsConfig(
      searchFrequency: FiniteDuration,
      searchQueries: List[SearchQuery],
      maxListingDuration: FiniteDuration,
      minMarginPercentage: Int
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

  final case class CexStockMonitorConfig(
      cacheExpiration: FiniteDuration,
      cacheValidationPeriod: FiniteDuration,
      monitoringFrequency: FiniteDuration,
      monitoringRequests: List[StockMonitorRequest]
  )

  final case class CexConfig(
      baseUri: String,
      priceFind: CexPriceFindConfig,
      stockMonitor: CexStockMonitorConfig
  )

  final case class TelegramConfig(
      baseUri: String,
      botKey: String,
      mainChannelId: String,
      secondaryChannelId: String
  )

  final case class AppConfig(
      server: ServerConfig,
      mongo: MongoConfig,
      cex: CexConfig,
      ebay: EbayConfig,
      telegram: TelegramConfig
  )

  object AppConfig {

    def load[F[_]: Sync: ContextShift](blocker: Blocker): F[AppConfig] =
      ConfigSource.default.loadF[F, AppConfig](blocker)
  }

}
