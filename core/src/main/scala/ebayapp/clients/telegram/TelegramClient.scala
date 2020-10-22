package ebayapp.clients.telegram

import cats.effect.Sync
import cats.implicits._
import ebayapp.common.config.TelegramConfig
import ebayapp.common.errors.AppError
import io.chrisdavenport.log4cats.Logger
import sttp.client._

final class TelegramClient[F[_]](
    val config: TelegramConfig
)(
    implicit val B: SttpBackend[F, Nothing, NothingT],
    val S: Sync[F],
    val L: Logger[F]
) {

  def sendMessageToMainChannel(message: String): F[Unit] =
    sendMessage(config.mainChannelId, message)

  def sendMessageToSecondaryChannel(message: String): F[Unit] =
    sendMessage(config.secondaryChannelId, message)

  def sendMessage(channelId: String, message: String): F[Unit] =
    basicRequest
      .get(uri"${config.baseUri}/bot${config.botKey}/sendMessage?chat_id=$channelId&text=$message")
      .send()
      .flatMap { r =>
        r.body match {
          case Right(_) => S.unit
          case Left(error) =>
            L.error(s"error sending message to telegram: ${r.code}\n$error") *>
              S.raiseError(AppError.Http(r.code.code, s"error sending message to telegram channel $channelId: ${r.code}"))
        }
      }
}

object TelegramClient {

  def make[F[_]: Sync: Logger](
      config: TelegramConfig,
      backend: SttpBackend[F, Nothing, NothingT]
  ): F[TelegramClient[F]] =
    Sync[F].delay(new TelegramClient[F](config)(B = backend, S = Sync[F], L = Logger[F]))
}
