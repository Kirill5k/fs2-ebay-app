package ebayapp.core.clients.telegram

import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import cats.syntax.apply.*
import cats.syntax.applicative.*
import ebayapp.core.clients.{HttpClient, MessengerClient}
import ebayapp.core.common.config.TelegramConfig
import ebayapp.core.domain.Notification
import ebayapp.kernel.errors.AppError
import ebayapp.core.common.{ConfigProvider, Logger}
import sttp.client3.*
import sttp.model.StatusCode

import scala.concurrent.duration.*

final private class LiveTelegramClient[F[_]](
    private val configProvider: ConfigProvider[F],
    override val backend: SttpBackend[F, Any]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends MessengerClient[F] with HttpClient[F] {

  override protected val name: String = "telegram"

  def send(notification: Notification): F[Unit] =
    configProvider.telegram.flatMap { config =>
      notification match {
        case Notification.Alert(message) => sendMessage(config.baseUri, config.botKey, config.alertsChannelId, message)
        case Notification.Deal(message)  => sendMessage(config.baseUri, config.botKey, config.mainChannelId, message)
        case Notification.Stock(message) => sendMessage(config.baseUri, config.botKey, config.secondaryChannelId, message)
      }
    }

  private def sendMessage(
      baseUri: String,
      botKey: String,
      channelId: String,
      message: String
  ): F[Unit] =
    dispatch {
      basicRequest
        .get(uri"$baseUri/bot$botKey/sendMessage?chat_id=$channelId&text=$message")
    }
      .flatMap { r =>
        r.body match {
          case Right(_) =>
            ().pure[F]
          case Left(_) if r.code == StatusCode.TooManyRequests =>
            F.sleep(10.seconds) *> sendMessage(baseUri, botKey, channelId, message)
          case Left(error) =>
            logger.warn(s"error sending message to telegram: ${r.code}\n$error") *>
              AppError.Http(r.code.code, s"error sending message to telegram channel $channelId: ${r.code}").raiseError[F, Unit]
        }
      }
}

object TelegramClient {

  def make[F[_]: Logger](
      configProvider: ConfigProvider[F],
      backend: SttpBackend[F, Any]
  )(using F: Temporal[F]): F[MessengerClient[F]] =
    F.pure(LiveTelegramClient[F](configProvider, backend))
}
