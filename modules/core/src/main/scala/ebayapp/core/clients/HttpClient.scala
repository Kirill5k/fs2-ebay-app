package ebayapp.core.clients

import cats.effect.Temporal
import cats.syntax.apply.*
import cats.syntax.applicativeError.*
import cats.syntax.flatMap.*
import ebayapp.core.common.Logger
import ebayapp.kernel.errors.AppError
import kirill5k.common.cats.syntax.applicative.*
import sttp.client3.{Request, Response, SttpBackend}
import sttp.model.HeaderNames

import scala.concurrent.duration.*

trait HttpClient[F[_]] {
  protected val name: String
  protected val httpBackend: SttpBackend[F, Any]
  protected val proxyBackend: Option[SttpBackend[F, Any]]

  protected val delayBetweenFailures: FiniteDuration = 10.seconds

  protected val operaUserAgent: String =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 OPR/89.0.4447.83"

  protected val postmanUserAgent: String = "PostmanRuntime/7.28.3"

  protected val acceptAnything: String = "*/*"

  protected val defaultHeaders: Map[String, String] = Map(
    HeaderNames.Accept         -> acceptAnything,
    HeaderNames.AcceptEncoding -> acceptAnything,
    HeaderNames.AcceptLanguage -> "en-GB,en;q=0.9",
    HeaderNames.CacheControl   -> "no-store, max-age=0",
    HeaderNames.ContentType    -> "application/json",
    HeaderNames.Connection     -> "keep-alive",
    HeaderNames.UserAgent      -> operaUserAgent
  )

  protected def dispatchWithProxy[T](
      useProxy: Option[Boolean]
  )(
      request: Request[T, Any]
  )(using
      F: Temporal[F],
      logger: Logger[F]
  ): F[Response[T]] =
    useProxy match
      case Some(true) => F.fromOption(proxyBackend, AppError.Critical("proxy is not setup")).flatMap(dispatchWithRetry(_, request))
      case _          => dispatchWithRetry(httpBackend, request)

  protected def dispatch[T](request: Request[T, Any])(using F: Temporal[F], logger: Logger[F]): F[Response[T]] =
    dispatchWithRetry(httpBackend, request)

  private def dispatchWithRetry[T](
      backend: SttpBackend[F, Any],
      request: Request[T, Any],
      attempt: Int = 0,
      maxRetries: Int = 100
  )(using
      F: Temporal[F],
      logger: Logger[F]
  ): F[Response[T]] =
    backend
      .send(request)
      .handleErrorWith { error =>
        if (attempt < maxRetries) {
          val cause      = Option(error.getCause)
          val errorClass = cause.fold(error.getClass.getSimpleName)(_.getClass.getSimpleName)
          val errorMsg   = cause.fold(error.getMessage)(_.getMessage)
          val message    = s"$name-client/${errorClass.toLowerCase}-$attempt: ${errorMsg}\n$error"
          F.ifTrueOrElse(attempt >= 50 && attempt % 10 == 0)(logger.error(message), logger.warn(message)) *>
            F.sleep(delayBetweenFailures) *> dispatchWithRetry(backend, request, attempt + 1, maxRetries)
        } else F.raiseError(error)
      }
}
