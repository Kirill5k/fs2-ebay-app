package ebayapp.core.clients.telegram

import cats.effect.Temporal
import cats.syntax.flatMap._
import cats.syntax.applicativeError._
import cats.syntax.apply._
import cats.syntax.applicative._
import ebayapp.core.clients.HttpClient
import ebayapp.core.common.config.TelegramConfig
import ebayapp.core.common.errors.AppError
import ebayapp.core.common.Logger
import sttp.client3._
import sttp.model.StatusCode

import scala.concurrent.duration._

trait TelegramClient[F[_]] extends HttpClient[F] {
  def sendMessageToMainChannel(message: String): F[Unit]
  def sendMessageToSecondaryChannel(message: String): F[Unit]
  def sendMessageToAlertsChannel(message: String): F[Unit]
}

final private class LiveTelegramClient[F[_]](
    private val config: TelegramConfig,
    override val backend: SttpBackend[F, Any]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends TelegramClient[F] {

  protected override val name: String = "telegram"

  def sendMessageToMainChannel(message: String): F[Unit] =
    sendMessage(config.mainChannelId, message)

  def sendMessageToSecondaryChannel(message: String): F[Unit] =
    sendMessage(config.secondaryChannelId, message)

  override def sendMessageToAlertsChannel(message: String): F[Unit] =
    sendMessage(config.alertsChannelId, message)

  private def sendMessage(channelId: String, message: String): F[Unit] =
    dispatch() {
      basicRequest
        .get(uri"${config.baseUri}/bot${config.botKey}/sendMessage?chat_id=$channelId&text=$message")
    }
      .flatMap { r =>
        r.body match {
          case Right(_) =>
            ().pure[F]
          case Left(_) if r.code == StatusCode.TooManyRequests =>
            F.sleep(10.seconds) *> sendMessage(channelId, message)
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
  )(implicit F: Temporal[F]): F[TelegramClient[F]] =
    F.pure(new LiveTelegramClient[F](config, backend))
}
