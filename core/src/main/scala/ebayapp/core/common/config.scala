package ebayapp.core.common

import cats.effect.Sync
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import cats.syntax.apply.*
import ebayapp.core.clients.{Retailer, SearchCriteria}
import ebayapp.core.domain.ItemKind
import pureconfig.ConfigConvert.catchReadError
import pureconfig.*
import pureconfig.generic.derivation.default.*
import pureconfig.configurable.genericMapReader

import java.io.File
import scala.concurrent.duration.{Duration, FiniteDuration}

object config {

  final case class MongoConfig(
      connectionUri: String,
      dbName: String
  ) derives ConfigReader

  final case class ServerConfig(
      host: String,
      port: Int
  ) derives ConfigReader

  final case class ClientProxyConfig(
      host: Option[String],
      port: Option[Int]
  ) derives ConfigReader

  final case class EbayCredentials(
      clientId: String,
      clientSecret: String
  ) derives ConfigReader

  final case class EbaySearchConfig(
      minFeedbackScore: Int,
      minFeedbackPercentage: Int,
      maxListingDuration: FiniteDuration
  ) derives ConfigReader

  final case class EbayConfig(
      baseUri: String,
      credentials: List[EbayCredentials],
      search: EbaySearchConfig
  ) derives ConfigReader

  final case class DealsFinderConfig(
      searchFrequency: FiniteDuration,
      searchRequests: List[DealsFinderRequest],
      delayBetweenRequests: Option[FiniteDuration] = None
  ) derives ConfigReader

  final case class DealsFinderRequest(
      searchCriteria: SearchCriteria,
      minMargin: Int,
      maxQuantity: Option[Int] = None
  ) derives ConfigReader

  final case class StockMonitorRequest(
      searchCriteria: SearchCriteria,
      monitorStockChange: Boolean,
      monitorPriceChange: Boolean,
      minDiscount: Option[Int] = None
  ) derives ConfigReader

  final case class StockMonitorConfig(
      monitoringFrequency: FiniteDuration,
      monitoringRequests: List[StockMonitorRequest],
      delayBetweenRequests: Option[FiniteDuration] = None
  ) derives ConfigReader

  final case class CacheConfig(
      expiration: FiniteDuration,
      validationPeriod: FiniteDuration
  ) derives ConfigReader

  final case class GenericRetailerConfig(
      baseUri: String,
      headers: Map[String, String] = Map.empty,
      proxied: Option[Boolean] = None,
      cache: Option[CacheConfig] = None
  ) derives ConfigReader

  final case class TelegramConfig(
      baseUri: String,
      botKey: String,
      mainChannelId: String,
      secondaryChannelId: String,
      alertsChannelId: String
  ) derives ConfigReader

  final case class AppConfig(
      server: ServerConfig,
      clientProxy: ClientProxyConfig,
      mongo: MongoConfig,
      ebay: EbayConfig,
      telegram: TelegramConfig,
      selfridges: GenericRetailerConfig,
      argos: GenericRetailerConfig,
      jdsports: GenericRetailerConfig,
      tessuti: GenericRetailerConfig,
      scotts: GenericRetailerConfig,
      nvidia: GenericRetailerConfig,
      scan: GenericRetailerConfig,
      cex: GenericRetailerConfig,
      stockMonitor: Map[Retailer, StockMonitorConfig],
      dealsFinder: Map[Retailer, DealsFinderConfig]
  ) derives ConfigReader

  object AppConfig {
    given stockMonitorMapReader: ConfigReader[Map[Retailer, StockMonitorConfig]] =
      genericMapReader[Retailer, StockMonitorConfig](catchReadError(Retailer.fromUnsafe))
    given dealsFinderMapReader: ConfigReader[Map[Retailer, DealsFinderConfig]] =
      genericMapReader[Retailer, DealsFinderConfig](catchReadError(Retailer.fromUnsafe))

    def load[F[_]](using F: Sync[F], logger: Logger[F]): F[AppConfig] =
      F.blocking(AppConfig.loadFromMount)
        .flatTap(_ => logger.info("loaded config from a configmap mount"))
        .handleErrorWith { e =>
          logger.warn(s"error loading a config from a configmap mount, will try resources: ${e.getMessage}") *>
            F.blocking(AppConfig.loadDefault)
        }

    def loadDefault: AppConfig   = ConfigSource.default.loadOrThrow[AppConfig]
    def loadFromMount: AppConfig = ConfigSource.file(new File("/opt/app/application.conf")).loadOrThrow[AppConfig]
  }

}
