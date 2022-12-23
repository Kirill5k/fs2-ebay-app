package ebayapp.core.clients

import cats.effect.Temporal
import cats.syntax.apply.*
import ebayapp.core.clients.argos.ArgosClient
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.ebay.EbayClient
import ebayapp.core.clients.flannels.FlannelsClient
import ebayapp.core.clients.harveynichols.HarveyNicholsClient
import ebayapp.core.clients.jd.JdClient
import ebayapp.core.clients.mainlinemenswear.MainlineMenswearClient
import ebayapp.core.clients.nvidia.NvidiaClient
import ebayapp.core.clients.scan.ScanClient
import ebayapp.core.clients.selfridges.SelfridgesClient
import ebayapp.core.clients.telegram.TelegramClient
import ebayapp.core.common.{ConfigProvider, Logger, Resources}
import ebayapp.core.common.config.AppConfig
import ebayapp.core.domain.Retailer
import ebayapp.core.domain.Retailer.Flannels

trait Clients[F[_]]:
  def cex: CexClient[F]
  def messenger: MessengerClient[F]
  def get(retailer: Retailer): SearchClient[F]

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
      JdClient.jdsports[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      JdClient.scotts[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      JdClient.tessuti[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      NvidiaClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      ScanClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      HarveyNicholsClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      MainlineMenswearClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend),
      FlannelsClient.make[F](configProvider, resources.httpClientBackend, resources.proxyClientBackend)
    ).mapN { (cexC, telC, ebayC, selfridgesC, argosC, jdC, scottsC, tessutiC, nvidiaC, scanC, harNichC, mmC, flC) =>
      new Clients[F] {
        def cex: CexClient[F]             = cexC
        def messenger: MessengerClient[F] = telC
        def get(retailer: Retailer): SearchClient[F] =
          retailer match
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
            case Retailer.Flannels         => flC
      }
    }
