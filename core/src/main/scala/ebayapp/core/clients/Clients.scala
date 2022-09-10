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

object Clients {

  def make[F[_]: Temporal: Logger](
      configProvider: ConfigProvider[F],
      config: AppConfig,
      resources: Resources[F]
  ): F[Clients[F]] =
    (
      CexClient.make[F](configProvider, resources.httpClientBackend),
      TelegramClient.make[F](configProvider, resources.httpClientBackend),
      EbayClient.make[F](configProvider, resources.httpClientBackend),
      SelfridgesClient.make[F](config.retailer.selfridges, resources.clientBackend(config.retailer.selfridges.proxied)),
      ArgosClient.make[F](config.retailer.argos, resources.clientBackend(config.retailer.argos.proxied)),
      JdsportsClient.jd[F](config.retailer.jdsports, resources.clientBackend(config.retailer.jdsports.proxied)),
      JdsportsClient.scotts[F](config.retailer.scotts, resources.clientBackend(config.retailer.scotts.proxied)),
      JdsportsClient.tessuti[F](config.retailer.tessuti, resources.clientBackend(config.retailer.tessuti.proxied)),
      NvidiaClient.make[F](config.retailer.nvidia, resources.clientBackend(config.retailer.nvidia.proxied)),
      ScanClient.make[F](config.retailer.scan, resources.clientBackend(config.retailer.scan.proxied)),
      HarveyNicholsClient.make[F](config.retailer.harveyNichols, resources.clientBackend(config.retailer.harveyNichols.proxied)),
      MainlineMenswearClient.make[F](config.retailer.mainlineMenswear, resources.clientBackend(config.retailer.mainlineMenswear.proxied))
    ).mapN { (cexC, telC, ebayC, selfridgesC, argosC, jdC, scottsC, tessutiC, nvidiaC, scanC, harNichC, mmC) =>
      new Clients[F] {
        def cex: CexClient[F]             = cexC
        def messenger: MessengerClient[F] = telC
        def get(shop: Retailer): SearchClient[F] =
          shop match {
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
    }

}
