package ebayapp.core.clients.telegram

import cats.effect.Temporal
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import ebayapp.core.clients.{Fs2HttpClient, MessengerClient}
import ebayapp.core.common.config.TelegramConfig
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.domain.Notification
import ebayapp.kernel.errors.AppError
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.*
import sttp.model.StatusCode

import scala.concurrent.duration.*

final private class LiveTelegramClient[F[_]](
    private val configProvider: () => F[TelegramConfig],
    override val backend: WebSocketStreamBackend[F, Fs2Streams[F]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends MessengerClient[F] with Fs2HttpClient[F] {

  override protected val name: String = "telegram"

  def send(n: Notification): F[Unit] =
    configProvider().flatMap { config =>
      dispatch {
        emptyRequest
          .get(uri"${config.baseUri}/bot${config.botKey}/sendMessage?chat_id=${config.channelId(n)}&text=${n.message}")
      }.flatMap { r =>
        r.body match
          case Right(_)                                        => F.unit
          case Left(_) if r.code == StatusCode.TooManyRequests => F.sleep(10.seconds) *> send(n)
          case Left(error) =>
            logger.error(s"error sending message to telegram: ${r.code}\n$error") *>
              F.raiseError(AppError.Http(r.code.code, s"error sending message to telegram channel ${config.channelId(n)}: ${r.code}"))
      }
    }

  extension (c: TelegramConfig)
    private def channelId(n: Notification): String =
      n match
        case _: Notification.Alert => c.alertsChannelId
        case _: Notification.Deal  => c.mainChannelId
        case _: Notification.Stock => c.secondaryChannelId
}

object TelegramClient:
  def make[F[_]: Logger](
      configProvider: RetailConfigProvider[F],
      backend: WebSocketStreamBackend[F, Fs2Streams[F]]
  )(using F: Temporal[F]): F[MessengerClient[F]] =
    F.pure(LiveTelegramClient[F](() => configProvider.telegram, backend))
