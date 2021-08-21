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
  def ebay: SearchClient[F]
  def cex: CexClient[F]
  def telegram: TelegramClient[F]
  def selfridges: SearchClient[F]
  def argos: SearchClient[F]
  def jdsports: SearchClient[F]
  def tessuti: SearchClient[F]
  def nvidia: SearchClient[F]
  def scan: SearchClient[F]
}

object Clients {

  def make[F[_]: Temporal: Logger](
      config: AppConfig,
      resources: Resources[F]
  ): F[Clients[F]] =
    (
      EbayClient.make[F](config.ebay, resources.clientBackend(false)),
      CexClient.make[F](config.cex, resources.clientBackend(false)),
      TelegramClient.make[F](config.telegram, resources.clientBackend(false)),
      SelfridgesClient.make[F](config.selfridges, resources.clientBackend(config.selfridges.proxied)),
      ArgosClient.make[F](config.argos, resources.clientBackend(config.argos.proxied)),
      JdsportsClient.jd[F](config.jdsports, resources.clientBackend(config.jdsports.proxied)),
      JdsportsClient.tessuti[F](config.tessuti, resources.clientBackend(config.tessuti.proxied)),
      NvidiaClient.make[F](config.nvidia, resources.clientBackend(config.nvidia.proxied)),
      ScanClient.make[F](config.scan, resources.clientBackend(config.scan.proxied))
    ).mapN { (ebayC, cc, telc, selfridgesC, ac, jc, tesc, nvidiaC, scanC) =>
      new Clients[F] {
        def ebay: SearchClient[F]       = ebayC
        def cex: CexClient[F]           = cc
        def telegram: TelegramClient[F] = telc
        def selfridges: SearchClient[F] = selfridgesC
        def argos: SearchClient[F]      = ac
        def jdsports: SearchClient[F]   = jc
        def tessuti: SearchClient[F]    = tesc
        def nvidia: SearchClient[F]     = nvidiaC
        def scan: SearchClient[F]       = scanC
      }
    }

}
