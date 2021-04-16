package ebayapp.core.clients.telegram

import cats.MonadError
import cats.implicits._
import ebayapp.core.common.config.TelegramConfig
import ebayapp.core.common.errors.AppError
import ebayapp.core.common.Logger
import sttp.client3._

trait TelegramClient[F[_]] {
  def sendMessageToMainChannel(message: String): F[Unit]
  def sendMessageToSecondaryChannel(message: String): F[Unit]
  def sendMessageToAlertsChannel(message: String): F[Unit]
}

final private class TelegramApiClient[F[_]](
    private val config: TelegramConfig,
    private val backend: SttpBackend[F, Any]
)(implicit
    F: MonadError[F, Throwable],
    logger: Logger[F]
) extends TelegramClient[F] {

  def sendMessageToMainChannel(message: String): F[Unit] =
    sendMessage(config.mainChannelId, message)

  def sendMessageToSecondaryChannel(message: String): F[Unit] =
    sendMessage(config.secondaryChannelId, message)

  override def sendMessageToAlertsChannel(message: String): F[Unit] =
    sendMessage(config.alertsChannelId, message)

  private def sendMessage(channelId: String, message: String): F[Unit] =
    basicRequest
      .get(uri"${config.baseUri}/bot${config.botKey}/sendMessage?chat_id=$channelId&text=$message")
      .send(backend)
      .flatMap { r =>
        r.body match {
          case Right(_) => ().pure[F]
          case Left(error) =>
            logger.warn(s"error sending message to telegram: ${r.code}\n$error") *>
              AppError.Http(r.code.code, s"error sending message to telegram channel $channelId: ${r.code}").raiseError[F, Unit]
        }
      }
}

object TelegramClient {

  def make[F[_]: Logger](
      config: TelegramConfig,
      backend: SttpBackend[F, Any]
  )(implicit F: MonadError[F, Throwable]): F[TelegramClient[F]] =
    F.pure(new TelegramApiClient[F](config, backend))
}
