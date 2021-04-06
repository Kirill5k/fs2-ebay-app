package ebayapp.clients

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.clients.argos.ArgosClient
import ebayapp.clients.cex.CexClient
import ebayapp.clients.ebay.EbayClient
import ebayapp.clients.selfridges.SelfridgesClient
import ebayapp.clients.telegram.TelegramClient
import ebayapp.common.config.AppConfig
import ebayapp.common.Logger
import sttp.client3.SttpBackend

trait Clients[F[_]] {
  def ebay: EbayClient[F]
  def cex: CexClient[F]
  def telegram: TelegramClient[F]
  def selfridges: SelfridgesClient[F]
  def argos: ArgosClient[F]
}

object Clients {

  def make[F[_]: Concurrent: Timer: Logger](
      config: AppConfig,
      backend: SttpBackend[F, Any]
  ): F[Clients[F]] =
    (
      EbayClient.make[F](config.ebay, backend),
      CexClient.make[F](config.cex, backend),
      TelegramClient.make[F](config.telegram, backend),
      SelfridgesClient.make[F](config.selfridges, backend),
      ArgosClient.make[F](config.argos, backend)
    ).mapN { (ec, cc, tc, sc, ac) =>
      new Clients[F] {
        def ebay: EbayClient[F]             = ec
        def cex: CexClient[F]               = cc
        def telegram: TelegramClient[F]     = tc
        def selfridges: SelfridgesClient[F] = sc
        def argos: ArgosClient[F]           = ac
      }
    }

}
