package ebayapp.core.clients

import cats.effect.Temporal
import cats.syntax.apply.*
import ebayapp.core.clients.argos.ArgosClient
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.ebay.EbayClient
import ebayapp.core.clients.harveynichols.HarveyNicholsClient
import ebayapp.core.clients.jdsports.JdsportsClient
import ebayapp.core.clients.mainlinemenswear.MainlineMenswearClient
import ebayapp.core.clients.nvidia.NvidiaClient
import ebayapp.core.clients.scan.ScanClient
import ebayapp.core.clients.selfridges.SelfridgesClient
import ebayapp.core.clients.telegram.TelegramClient
import ebayapp.core.common.{ConfigProvider, Logger, Resources}
import ebayapp.core.common.config.AppConfig

trait Clients[F[_]]:
  def cex: CexClient[F]
  def messenger: MessengerClient[F]
  def get(shop: Retailer): SearchClient[F]

object Clients:
  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      resources: Resources[F]
  ): F[Clients[F]] =
    (
      CexClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      TelegramClient.make[F](configProvider, resources.httpClientBackend),
      EbayClient.make[F](configProvider, resources.httpClientBackend),
      SelfridgesClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      ArgosClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      JdsportsClient.jd[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      JdsportsClient.scotts[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      JdsportsClient.tessuti[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      NvidiaClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      ScanClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      HarveyNicholsClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      MainlineMenswearClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
    ).mapN { (cexC, telC, ebayC, selfridgesC, argosC, jdC, scottsC, tessutiC, nvidiaC, scanC, harNichC, mmC) =>
      new Clients[F] {
        def cex: CexClient[F]             = cexC
        def messenger: MessengerClient[F] = telC
        def get(shop: Retailer): SearchClient[F] =
          shop match
            case Retailer.Cex              => cexC
            case Retailer.Ebay             => ebayC
            case Retailer.Selfridges       => selfridgesC
            case Retailer.Argos            => argosC
            case Retailer.Scotts           => scottsC
            case Retailer.Jdsports         => jdC
            case Retailer.Tessuti          => tessutiC
            case Retailer.Nvidia           => nvidiaC
            case Retailer.Scan             => scanC
            case Retailer.HarveyNichols    => harNichC
            case Retailer.MainlineMenswear => mmC
      }
    }
