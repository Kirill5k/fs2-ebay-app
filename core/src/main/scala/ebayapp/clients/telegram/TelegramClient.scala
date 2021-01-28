package ebayapp.clients.telegram

import cats.effect.Sync
import cats.implicits._
import ebayapp.common.config.TelegramConfig
import ebayapp.common.errors.AppError
import ebayapp.common.Logger
import sttp.client3._

trait TelegramClient[F[_]] {
  def sendMessageToMainChannel(message: String): F[Unit]
  def sendMessageToSecondaryChannel(message: String): F[Unit]
  def sendMessage(channelId: String, message: String): F[Unit]
}

final class TelegramApiClient[F[_]](
    private val config: TelegramConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    val S: Sync[F],
    val L: Logger[F]
) extends TelegramClient[F] {

  def sendMessageToMainChannel(message: String): F[Unit] =
    sendMessage(config.mainChannelId, message)

  def sendMessageToSecondaryChannel(message: String): F[Unit] =
    sendMessage(config.secondaryChannelId, message)

  def sendMessage(channelId: String, message: String): F[Unit] =
    basicRequest
      .get(uri"${config.baseUri}/bot${config.botKey}/sendMessage?chat_id=$channelId&text=$message")
      .send(backend)
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
      backend: SttpBackend[F, Any]
  ): F[TelegramClient[F]] =
    Sync[F].delay(new TelegramApiClient[F](config, backend))
}
