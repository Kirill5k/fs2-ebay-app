package ebayapp.core.clients

import cats.effect.Temporal
import cats.implicits._
import ebayapp.core.clients.argos.ArgosClient
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.ebay.EbayClient
import ebayapp.core.clients.jdsports.JdsportsClient
import ebayapp.core.clients.nvidia.NvidiaClient
import ebayapp.core.clients.scan.ScanClient
import ebayapp.core.clients.selfridges.SelfridgesClient
import ebayapp.core.clients.telegram.TelegramClient
import ebayapp.core.common.{Logger, Resources}
import ebayapp.core.common.config.AppConfig

trait Clients[F[_]] {
  def cex: CexClient[F]
  def telegram: TelegramClient[F]

  def get(shop: Retailer): SearchClient[F]
}

object Clients {

  def make[F[_]: Temporal: Logger](
      config: AppConfig,
      resources: Resources[F]
  ): F[Clients[F]] =
    (
      CexClient.make[F](config.cex, resources.clientBackend(false)),
      TelegramClient.make[F](config.telegram, resources.clientBackend(false)),
      EbayClient.make[F](config.ebay, resources.clientBackend(false)),
      SelfridgesClient.make[F](config.selfridges, resources.clientBackend(config.selfridges.proxied)),
      ArgosClient.make[F](config.argos, resources.clientBackend(config.argos.proxied)),
      JdsportsClient.jd[F](config.jdsports, resources.clientBackend(config.jdsports.proxied)),
      JdsportsClient.scotts[F](config.scotts, resources.clientBackend(config.scotts.proxied)),
      JdsportsClient.tessuti[F](config.tessuti, resources.clientBackend(config.tessuti.proxied)),
      NvidiaClient.make[F](config.nvidia, resources.clientBackend(config.nvidia.proxied)),
      ScanClient.make[F](config.scan, resources.clientBackend(config.scan.proxied))
    ).mapN { (cexC, telC, ebayC, selfridgesC, argosC, jdC, scottsC, tessutiC, nvidiaC, scanC) =>
      new Clients[F] {
        def cex: CexClient[F]           = cexC
        def telegram: TelegramClient[F] = telC
        def get(shop: Retailer): SearchClient[F] =
          shop match {
            case Retailer.Cex        => cexC
            case Retailer.Ebay       => ebayC
            case Retailer.Selfridges => selfridgesC
            case Retailer.Argos      => argosC
            case Retailer.Scotts     => scottsC
            case Retailer.Jdsports   => jdC
            case Retailer.Tessuti    => tessutiC
            case Retailer.Nvidia     => nvidiaC
            case Retailer.Scan       => scanC
          }
      }
    }

}
