package ebayapp.core.clients.ntfy

import cats.effect.Temporal
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import ebayapp.core.clients.{Fs2HttpClient, MessengerClient}
import ebayapp.core.common.config.NtfyConfig
import ebayapp.core.common.{Logger, RetailConfigProvider}
import ebayapp.core.domain.Notification
import ebayapp.kernel.errors.AppError
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.*
import sttp.model.{MediaType, StatusCode}

import scala.concurrent.duration.*

final private class LiveNtfyClient[F[_]](
    private val configProvider: () => F[NtfyConfig],
    override val backend: WebSocketStreamBackend[F, Fs2Streams[F]]
)(using
    F: Temporal[F],
    logger: Logger[F]
) extends MessengerClient[F] with Fs2HttpClient[F] {

  override protected val name: String = "ntfy"

  def send(n: Notification): F[Unit] =
    configProvider().flatMap { config =>
      dispatch {
        basicRequest
          .post(uri"${config.baseUri}/${config.topic(n)}")
          .header("Title", n.title)
          .header("Click", n.url)
          .header("Attach", n.image)
          .contentType(MediaType.TextPlain)
          .body(n.message)
      }.flatMap { r =>
        r.body match
          case Right(_)                                        => F.unit
          case Left(_) if r.code == StatusCode.TooManyRequests => F.sleep(10.seconds) *> send(n)
          case Left(error)                                     =>
            logger.error(s"error sending message to ntfy: ${r.code}\n$error") *>
              F.raiseError(AppError.Http(r.code.code, s"error sending message to ntfy topic ${config.topic(n)}"))
      }
    }

  extension (c: NtfyConfig)
    private def topic(n: Notification): String =
      n match
        case _: Notification.Alert => c.alertsTopic
        case _: Notification.Deal  => c.dealsTopic
        case _: Notification.Stock => c.stockTopic
}

object NtfyClient:
  def make[F[_]: Logger](
      configProvider: RetailConfigProvider[F],
      backend: WebSocketStreamBackend[F, Fs2Streams[F]]
  )(using F: Temporal[F]): F[MessengerClient[F]] =
    F.pure(LiveNtfyClient[F](() => configProvider.ntfy, backend))
