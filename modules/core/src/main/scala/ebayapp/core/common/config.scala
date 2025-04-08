package ebayapp.core.common

import cats.effect.Async
import io.circe.Codec
import ebayapp.kernel.json.given
import ebayapp.core.domain.Retailer
import ebayapp.core.domain.search.{Filters, SearchCriteria}
import ebayapp.kernel.config.{ClientConfig, MongoConfig, ServerConfig}
import pureconfig.ConfigConvert.catchReadError
import pureconfig.*
import pureconfig.configurable.genericMapReader

import java.io.File
import scala.concurrent.duration.FiniteDuration
import scala.util.Random

object config {

  final case class OAuthCredentials(
      clientId: String,
      clientSecret: String
  ) derives ConfigReader, Codec.AsObject

  final case class EbaySearchConfig(
      minFeedbackScore: Int,
      minFeedbackPercentage: Int,
      maxListingDuration: FiniteDuration
  ) derives ConfigReader, Codec.AsObject

  final case class EbayConfig(
      baseUri: String,
      credentials: List[OAuthCredentials],
      search: EbaySearchConfig
  ) derives ConfigReader, Codec.AsObject

  final case class CacheConfig(
      expiration: FiniteDuration,
      validationPeriod: FiniteDuration
  ) derives ConfigReader, Codec.AsObject

  final case class GenericRetailerConfig(
      baseUri: String,
      headers: Map[String, String] = Map.empty,
      cache: Option[CacheConfig] = None,
      delayBetweenIndividualRequests: Option[FiniteDuration] = None,
      queryParameters: Option[Map[String, String]] = None,
      baseUris: Option[Vector[String]] = None
  ) derives ConfigReader, Codec.AsObject {
    def uri: String =
      baseUris.filter(_.nonEmpty) match
        case None       => baseUri
        case Some(uris) => uris(Random.nextInt(uris.length))
  }

  final case class TelegramConfig(
      baseUri: String,
      botKey: String,
      mainChannelId: String,
      secondaryChannelId: String,
      alertsChannelId: String
  ) derives ConfigReader, Codec.AsObject

  final case class RetailerConfig(
      ebay: EbayConfig,
      selfridges: GenericRetailerConfig,
      argos: GenericRetailerConfig,
      jdsports: GenericRetailerConfig,
      tessuti: GenericRetailerConfig,
      scotts: GenericRetailerConfig,
      harveyNichols: GenericRetailerConfig,
      mainlineMenswear: GenericRetailerConfig,
      nvidia: GenericRetailerConfig,
      scan: GenericRetailerConfig,
      cex: GenericRetailerConfig,
      flannels: GenericRetailerConfig
  ) derives ConfigReader, Codec.AsObject

  final case class DealsFinderConfig(
      searchFrequency: FiniteDuration,
      searchRequests: List[DealsFinderRequest],
      delayBetweenRequests: Option[FiniteDuration] = None
  ) derives ConfigReader, Codec.AsObject

  final case class DealsFinderRequest(
      searchCriteria: SearchCriteria,
      minMargin: Int,
      maxQuantity: Option[Int] = None
  ) derives ConfigReader, Codec.AsObject

  final case class StockMonitorRequest(
      searchCriteria: SearchCriteria,
      monitorStockChange: Boolean,
      monitorPriceChange: Boolean,
      disableNotifications: Option[Boolean] = None
  ) derives ConfigReader, Codec.AsObject

  final case class StockMonitorConfig(
      monitoringFrequency: FiniteDuration,
      monitoringRequests: List[StockMonitorRequest],
      delayBetweenRequests: Option[FiniteDuration] = None,
      filters: Option[Filters] = None
  ) derives ConfigReader, Codec.AsObject

  final case class AppConfig(
      server: ServerConfig,
      client: ClientConfig,
      mongo: MongoConfig
  ) derives ConfigReader

  object AppConfig {
    def loadDefault[F[_]](using F: Async[F]): F[AppConfig] =
      F.blocking(ConfigSource.default.loadOrThrow[AppConfig])
  }

  final case class RetailConfig(
      telegram: TelegramConfig,
      retailer: RetailerConfig,
      stockMonitor: Map[Retailer, StockMonitorConfig],
      dealsFinder: Map[Retailer, DealsFinderConfig]
  ) derives ConfigReader, Codec.AsObject

  object RetailConfig {
    val mountedConfigPath = "/opt/app/application.conf"

    given stockMonitorMapReader: ConfigReader[Map[Retailer, StockMonitorConfig]] =
      genericMapReader[Retailer, StockMonitorConfig](catchReadError(Retailer.fromUnsafe))
    given dealsFinderMapReader: ConfigReader[Map[Retailer, DealsFinderConfig]] =
      genericMapReader[Retailer, DealsFinderConfig](catchReadError(Retailer.fromUnsafe))

    def loadDefault[F[_]](using F: Async[F]): F[RetailConfig] =
      F.blocking(ConfigSource.default.loadOrThrow[RetailConfig])
    def loadFromMount[F[_]](using F: Async[F]): F[RetailConfig] =
      F.blocking(ConfigSource.file(new File(mountedConfigPath)).loadOrThrow[RetailConfig])
  }

}
