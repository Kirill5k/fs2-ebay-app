package ebayapp.core.clients

import cats.effect.Temporal
import cats.syntax.applicativeError.*
import cats.syntax.apply.*
import ebayapp.core.common.Logger
import kirill5k.common.cats.syntax.applicative.*
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.{Request, Response, WebSocketStreamBackend}
import sttp.model.HeaderNames

import scala.concurrent.duration.*

trait Fs2HttpClient[F[_]] {
  protected val name: String
  protected val backend: WebSocketStreamBackend[F, Fs2Streams[F]]

  protected val delayBetweenFailures: FiniteDuration = 10.seconds

  protected val acceptAnything: String = "*/*"

  protected val defaultHeaders: Map[String, String] = Map(
    HeaderNames.Accept         -> acceptAnything,
    HeaderNames.AcceptEncoding -> acceptAnything,
    HeaderNames.AcceptLanguage -> "en-GB,en;q=0.9",
    HeaderNames.CacheControl   -> "no-store, max-age=0",
    HeaderNames.ContentType    -> "application/json",
    HeaderNames.Connection     -> "keep-alive",
    HeaderNames.UserAgent      -> UserAgentGenerator.random
  )

  protected def dispatch[T](request: Request[T])(using F: Temporal[F], logger: Logger[F]): F[Response[T]] =
    dispatchWithRetry(request)

  private def dispatchWithRetry[T](
      request: Request[T],
      attempt: Int = 0,
      maxRetries: Int = 100
  )(using
      F: Temporal[F],
      logger: Logger[F]
  ): F[Response[T]] =
    request
      .send[F](backend)
      .handleErrorWith { error =>
        if (attempt < maxRetries) {
          val cause   = Option(error.getCause).getOrElse(error)
          val message = s"$name-client/${cause.getClass.getSimpleName.toLowerCase}-$attempt: ${cause.getMessage}\n$error"
          F.ifTrueOrElse(attempt >= 50 && attempt % 10 == 0)(logger.error(message), logger.warn(message)) *>
            F.sleep(delayBetweenFailures) *> dispatchWithRetry(request, attempt + 1, maxRetries)
        } else F.raiseError(error)
      }
}
