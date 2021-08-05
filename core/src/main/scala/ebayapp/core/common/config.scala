package ebayapp.core.common

import cats.effect.kernel.Sync
import cats.implicits._
import java.nio.charset.StandardCharsets
import java.util.Base64
import pureconfig._
import pureconfig.generic.auto._

import java.io.File
import scala.concurrent.duration.FiniteDuration

object config {

  final case class MongoConfig(
      connectionUri: String
  )

  final case class ServerConfig(
      host: String,
      port: Int
  )

  final case class ClientConfig(
      proxyHost: Option[String],
      proxyPort: Option[Int],
      onlyProxyHosts: List[String]
  )

  final case class SearchQuery(value: String) extends AnyVal {
    def base64: String =
      Base64.getEncoder.encodeToString(value.replaceAll(" ", "").getBytes(StandardCharsets.UTF_8))
  }

  final case class SearchCategory(value: String) extends AnyVal

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
      monitorPriceChange: Boolean,
      category: Option[SearchCategory] = None,
      minDiscount: Option[Int] = None
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

  final case class JdsportsConfig(
      baseUri: String,
      stockMonitor: StockMonitorConfig
  )

  final case class NvidiaConfig(
      baseUri: String,
      stockMonitor: StockMonitorConfig
  )

  final case class ScanConfig(
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
      client: ClientConfig,
      mongo: MongoConfig,
      cex: CexConfig,
      ebay: EbayConfig,
      selfridges: SelfridgesConfig,
      argos: ArgosConfig,
      jdsports: JdsportsConfig,
      nvidia: NvidiaConfig,
      scan: ScanConfig,
      telegram: TelegramConfig
  )

  object AppConfig {

    def load[F[_]](implicit F: Sync[F], logger: Logger[F]): F[AppConfig] =
      F.blocking(AppConfig.loadFromMount)
        .flatTap(_ => logger.info("loaded config from a configmap mount"))
        .handleErrorWith { _ =>
          logger.warn("error loading a config from a configmap mount, will try resources") *>
            F.blocking(ConfigSource.default.loadOrThrow[AppConfig])
        }

    def loadDefault: AppConfig   = ConfigSource.default.loadOrThrow[AppConfig]
    def loadFromMount: AppConfig = ConfigSource.file(new File("/opt/app/application.conf")).loadOrThrow[AppConfig]
  }

}
