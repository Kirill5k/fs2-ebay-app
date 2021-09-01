package ebayapp.core.clients

import cats.effect.Temporal
import cats.syntax.apply._
import cats.syntax.applicativeError._
import ebayapp.core.common.Logger
import sttp.client3.{Request, Response, SttpBackend}

import scala.concurrent.duration._

trait HttpClient[F[_]] {
  protected val name: String
  protected val backend: SttpBackend[F, Any]

  protected val delayBetweenFailures: FiniteDuration = 10.seconds

  protected val defaultHeaders = Map(
    "Access-Control-Allow-Origin" -> "*",
    "Content-Type"                -> "application/json",
    "Connection"                  -> "keep-alive",
    "Cache-Control"               -> "no-store, max-age=0",
    "Accept"                      -> "*/*",
    "Accept-Encoding"             -> "gzip, deflate, br",
    "Accept-Language"             -> "en-GB,en-US;q=0.9,en;q=0.8",
    "Accept"                      -> "application/json, text/javascript, */*; q=0.01",
    "Connection"                  -> "keep-alive",
    "User-Agent"                  -> "PostmanRuntime/7.28.3"
  )

  protected def dispatch[T](attempt: Int = 0)(request: Request[T, Any])(implicit F: Temporal[F], logger: Logger[F]): F[Response[T]] =
    backend
      .send(request)
      .handleErrorWith { error =>
        val cause      = Option(error.getCause)
        val errorClass = cause.fold(error.getClass)(_.getClass)
        val errorMsg   = cause.fold(error.getMessage)(_.getMessage)
        val message    = s"$name-client/${errorClass.getSimpleName.toLowerCase}-$attempt: ${errorMsg}\n$error"
        (if (attempt > 5) logger.error(message) else logger.warn(message)) *>
          F.sleep(delayBetweenFailures) *> dispatch(attempt + 1)(request)
      }
}
