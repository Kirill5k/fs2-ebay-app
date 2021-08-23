package ebayapp.core.common

import cats.effect.kernel.Sync
import cats.implicits._
import ebayapp.core.clients.{Retailer, SearchCriteria}
import ebayapp.core.domain.ItemKind
import pureconfig.ConfigConvert.catchReadError
import pureconfig._
import pureconfig.configurable.genericMapReader
import pureconfig.generic.auto._
import pureconfig.generic.semiauto._

import java.io.File
import scala.concurrent.duration.{Duration, FiniteDuration}

object config {

  final case class MongoConfig(
      connectionUri: String,
      dbName: String
  )

  final case class ServerConfig(
      host: String,
      port: Int
  )

  final case class ClientProxyConfig(
      host: Option[String],
      port: Option[Int]
  )

  final case class EbayCredentials(
      clientId: String,
      clientSecret: String
  )

  final case class EbaySearchConfig(
      minFeedbackScore: Int,
      minFeedbackPercentage: Int,
      maxListingDuration: FiniteDuration
  )

  final case class EbayConfig(
      baseUri: String,
      credentials: List[EbayCredentials],
      search: EbaySearchConfig,
      dealsFinder: DealsFinderConfig
  )

  final case class DealsFinderConfig(
      searchFrequency: FiniteDuration,
      searchRequests: List[DealsFinderRequest],
      delayBetweenRequests: FiniteDuration = Duration.Zero
  )

  final case class DealsFinderRequest(
      searchCriteria: SearchCriteria,
      minMargin: Int,
      maxQuantity: Option[Int] = None
  )

  final case class StockMonitorRequest(
      searchCriteria: SearchCriteria,
      monitorStockChange: Boolean,
      monitorPriceChange: Boolean,
      minDiscount: Option[Int] = None
  )

  final case class StockMonitorConfig(
      monitoringFrequency: FiniteDuration,
      monitoringRequests: List[StockMonitorRequest]
  )

  final case class CacheConfig(
      expiration: FiniteDuration,
      validationPeriod: FiniteDuration
  )

  final case class CexConfig(
      baseUri: String,
      cache: CacheConfig
  )

  final case class GenericStoreConfig(
      baseUri: String,
      headers: Map[String, String] = Map.empty[String, String],
      proxied: Boolean = false
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
      clientProxy: ClientProxyConfig,
      mongo: MongoConfig,
      cex: CexConfig,
      ebay: EbayConfig,
      selfridges: GenericStoreConfig,
      argos: GenericStoreConfig,
      jdsports: GenericStoreConfig,
      tessuti: GenericStoreConfig,
      scotts: GenericStoreConfig,
      nvidia: GenericStoreConfig,
      scan: GenericStoreConfig,
      telegram: TelegramConfig,
      stockMonitor: Map[Retailer, StockMonitorConfig]
  )

  object AppConfig {
    implicit val itemKindConverted: ConfigReader[ItemKind] = deriveEnumerationReader[ItemKind]
    implicit val stockMonitorMapReader = genericMapReader[Retailer, StockMonitorConfig](catchReadError(Retailer.fromUnsafe))

    def load[F[_]](implicit F: Sync[F], logger: Logger[F]): F[AppConfig] =
      F.blocking(AppConfig.loadFromMount)
        .flatTap(_ => logger.info("loaded config from a configmap mount"))
        .handleErrorWith { e =>
          logger.warn(e)("error loading a config from a configmap mount, will try resources") *>
            F.blocking(AppConfig.loadDefault)
        }

    def loadDefault: AppConfig   = ConfigSource.default.loadOrThrow[AppConfig]
    def loadFromMount: AppConfig = ConfigSource.file(new File("/opt/app/application.conf")).loadOrThrow[AppConfig]
  }

}
