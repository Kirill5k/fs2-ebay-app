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
import ebayapp.core.common.Logger
import ebayapp.core.common.config.AppConfig
import sttp.client3.SttpBackend

trait Clients[F[_]] {
  def ebay: EbayClient[F]
  def cex: CexClient[F]
  def telegram: TelegramClient[F]
  def selfridges: SelfridgesClient[F]
  def argos: ArgosClient[F]
  def jdsports: JdsportsClient[F]
  def nvidia: NvidiaClient[F]
  def scan: ScanClient[F]
}

object Clients {

  def make[F[_]: Temporal: Logger](
      config: AppConfig,
      backend: SttpBackend[F, Any]
  ): F[Clients[F]] =
    (
      EbayClient.make[F](config.ebay, backend),
      CexClient.make[F](config.cex, backend),
      TelegramClient.make[F](config.telegram, backend),
      SelfridgesClient.make[F](config.selfridges, backend),
      ArgosClient.make[F](config.argos, backend),
      JdsportsClient.make[F](config.jdsports, backend),
      NvidiaClient.make[F](config.nvidia, backend),
      ScanClient.make[F](config.scan, backend)
    ).mapN { (ebayC, cc, tc, selfridgesC, ac, jc, nvidiaC, scanC) =>
      new Clients[F] {
        def ebay: EbayClient[F]             = ebayC
        def cex: CexClient[F]               = cc
        def telegram: TelegramClient[F]     = tc
        def selfridges: SelfridgesClient[F] = selfridgesC
        def argos: ArgosClient[F]           = ac
        def jdsports: JdsportsClient[F]     = jc
        def nvidia: NvidiaClient[F]         = nvidiaC
        override def scan: ScanClient[F]    = scanC
      }
    }

}
