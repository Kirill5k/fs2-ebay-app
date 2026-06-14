package ebayapp.core.clients

import cats.effect.Temporal
import cats.syntax.applicativeError.*
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import ebayapp.core.common.Logger
import kirill5k.common.cats.syntax.applicative.*
import sttp.capabilities.fs2.Fs2Streams
import sttp.client4.{Request, Response, WebSocketStreamBackend}

import scala.concurrent.duration.*
import scala.util.Random

trait Fs2HttpClient[F[_]] {
  protected val name: String
  protected val backend: WebSocketStreamBackend[F, Fs2Streams[F]]

  protected val acceptAnything: String = "*/*"

  protected def calculateBackoffDelay(
      attempt: Int,
      baseDelay: FiniteDuration = 5.second,
      maxDelay: FiniteDuration = 2.minutes,
      jitterFactor: Double = 0.2
  ): FiniteDuration = {
    val exponentialDelayMs = baseDelay.toMillis * Math.pow(2, attempt).toLong
    val cappedDelayMs      = Math.min(exponentialDelayMs, maxDelay.toMillis)
    val jitter             = (Random.nextDouble() * 2 - 1) * jitterFactor * cappedDelayMs
    val finalDelayMs       = Math.max(1, Math.min(maxDelay.toMillis, (cappedDelayMs + jitter).toLong))
    finalDelayMs.millis
  }

  protected def dispatch[T](request: Request[T])(using F: Temporal[F], logger: Logger[F]): F[Response[T]] =
    dispatchWithRetry(request)

  private def dispatchWithRetry[T](
      request: Request[T],
      attempt: Int = 0,
      maxRetries: Int = 10
  )(using
      F: Temporal[F],
      logger: Logger[F]
  ): F[Response[T]] =
    request
      .send[F](backend)
      .flatMap { response =>
        if (response.code.code >= 500 && attempt < maxRetries) {
          logger.warn(s"$name-client/server-error-$attempt: status=${response.code.code}") *>
            F.sleep(calculateBackoffDelay(attempt)) *> dispatchWithRetry(request, attempt + 1, maxRetries)
        } else F.pure(response)
      }
      .handleErrorWith { error =>
        if (attempt < maxRetries) {
          val cause   = Option(error.getCause).getOrElse(error)
          val message = s"$name-client/${cause.getClass.getSimpleName.toLowerCase}-$attempt: ${cause.getMessage}\n$error"
          F.ifTrueOrElse(attempt >= 5 && attempt % 5 == 0)(logger.error(message), logger.warn(message)) *>
            F.sleep(calculateBackoffDelay(attempt)) *> dispatchWithRetry(request, attempt + 1, maxRetries)
        } else F.raiseError(error)
      }
}
