package ebayapp.clients

import cats.effect.{Concurrent, Timer}
import cats.implicits._
import ebayapp.clients.cex.CexClient
import ebayapp.clients.ebay.EbayClient
import ebayapp.clients.selfridges.SelfridgesClient
import ebayapp.clients.telegram.TelegramClient
import ebayapp.common.config.AppConfig
import io.chrisdavenport.log4cats.Logger
import sttp.client.{NothingT, SttpBackend}

final case class Clients[F[_]](
    ebay: EbayClient[F],
    cex: CexClient[F],
    telegram: TelegramClient[F],
    selfridges: SelfridgesClient[F]
)

object Clients {

  def make[F[_]: Concurrent: Timer: Logger](
      config: AppConfig,
      backend: SttpBackend[F, Nothing, NothingT]
  ): F[Clients[F]] = {
    val ebay = EbayClient.make[F](config.ebay, backend)
    val cex = CexClient.make[F](config.cex, backend)
    val telegram = TelegramClient.make[F](config.telegram, backend)
    val selfridges = SelfridgesClient.make[F](config.selfridges, backend)
    (ebay, cex, telegram, selfridges).mapN(Clients.apply)
  }
}
