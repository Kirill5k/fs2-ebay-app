package ebayapp.core.clients

import cats.effect.Temporal
import cats.syntax.apply.*
import cats.syntax.applicativeError.*
import ebayapp.core.common.Logger
import sttp.client3.{Request, Response, SttpBackend}

import scala.concurrent.duration.*

trait HttpClient[F[_]] {
  protected val name: String
  protected val backend: SttpBackend[F, Any]

  protected val delayBetweenFailures: FiniteDuration = 10.seconds

  protected val userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 OPR/89.0.4447.83"

  protected val defaultHeaders = Map(
    "accept"             -> "*/*",
    "accept-encoding"    -> "gzip, deflate, br",
    "accept-language"    -> "en-GB,en;q=0.9",
    "cache-control"      -> "no-store, max-age=0",
    "content-type"       -> "application/json",
    "sec-ch-ua"          -> """" Not A;Brand";v="99", "Chromium";v="104", "Opera";v="90"""",
    "sec-ch-ua-mobile"   -> "?0",
    "sec-ch-ua-platform" -> "macOS",
    "sec-fetch-dest"     -> "empty",
    "sec-fetch-mode"     -> "cors",
    "sec-fetch-site"     -> "same-origin",
    "connection"         -> "keep-alive",
    "user-agent"         -> userAgent
  )

  protected def dispatch[T](request: Request[T, Any])(using F: Temporal[F], logger: Logger[F]): F[Response[T]] =
    dispatchWithRetry(request)

  private def dispatchWithRetry[T](request: Request[T, Any], attempt: Int = 0)(using F: Temporal[F], logger: Logger[F]): F[Response[T]] =
    backend
      .send(request)
      .handleErrorWith { error =>
        val cause      = Option(error.getCause)
        val errorClass = cause.fold(error.getClass.getSimpleName)(_.getClass.getSimpleName)
        val errorMsg   = cause.fold(error.getMessage)(_.getMessage)
        val message    = s"$name-client/${errorClass.toLowerCase}-$attempt: ${errorMsg}\n$error"
        (if (attempt >= 50 && attempt % 10 == 0) logger.error(message) else logger.warn(message)) *>
          F.sleep(delayBetweenFailures) *> dispatchWithRetry(request, attempt + 1)
      }
}
