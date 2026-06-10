package ebayapp.core.clients

import cats.effect.Async
import cats.effect.std.Semaphore
import cats.syntax.applicativeError.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import kirill5k.common.cats.syntax.sync.*
import sttp.model.StatusCode
import CurlImpersonateClient.RetrySpec

import java.io.IOException
import scala.concurrent.duration.*
import scala.util.Random

trait CurlImpersonateClient[F[_]]:
  def get(url: String, headers: Map[String, String], retrySpec: RetrySpec = RetrySpec()): F[(StatusCode, String)]

final private class LiveCurlImpersonateClient[F[_]](
    private val semaphore: Semaphore[F],
    private val timeout: FiniteDuration
)(using
    F: Async[F]
) extends CurlImpersonateClient[F] {

  private val statusDelimiter = "---HTTP_STATUS---"

  private val curlCmd = List(
    "curl_chrome116",
    "-s",
    "-L",
    "--max-time",
    timeout.toSeconds.toString,
    "--cacert",
    "/etc/ssl/certs/ca-bundle.crt",
    "-w",
    s"\n$statusDelimiter%{http_code}"
  )

  private def calculateBackoffDelay(
      attempt: Int,
      maxDelay: FiniteDuration,
      baseDelay: FiniteDuration = 5.second,
      jitterFactor: Double = 0.2
  ): FiniteDuration = {
    val exponentialDelayMs = baseDelay.toMillis * Math.pow(2, attempt).toLong
    val cappedDelayMs      = Math.min(exponentialDelayMs, maxDelay.toMillis)
    val jitter             = (Random.nextDouble() * 2 - 1) * jitterFactor * cappedDelayMs
    val finalDelayMs       = Math.max(1, Math.min(maxDelay.toMillis, (cappedDelayMs + jitter).toLong))
    finalDelayMs.millis
  }

  override def get(url: String, headers: Map[String, String], retrySpec: RetrySpec = RetrySpec()): F[(StatusCode, String)] =
    getWithRetry(url, headers, retrySpec, attempt = 0)

  private def getWithRetry(url: String, headers: Map[String, String], retrySpec: RetrySpec, attempt: Int): F[(StatusCode, String)] =
    semaphore.permit
      .surround {
        for
          headerArgs = headers.flatMap((k, v) => List("-H", s"$k: $v")).toList
          result <- F.cmd(curlCmd ++ headerArgs :+ url)
          _      <- F.raiseWhen(result.isError)(new IOException(s"curl failed (exit ${result.exitCode}): ${result.stderr}"))
          idx  = result.stdout.lastIndexOf(statusDelimiter)
          code = StatusCode(result.stdout.substring(idx + statusDelimiter.length).trim.toInt)
          body = result.stdout.substring(0, idx)
        yield code -> body
      }
      .flatMap { (code, body) =>
        val shouldRetry =
          (retrySpec.retryOnClientError && code.isClientError || retrySpec.retryOnServerError && code.isServerError) &&
            !retrySpec.retryExcludedCodes.contains(code) &&
            attempt < retrySpec.maxRetries
        if shouldRetry then
          F.sleep(calculateBackoffDelay(attempt, retrySpec.maxDelay)) >>
            getWithRetry(url, headers, retrySpec, attempt + 1)
        else F.pure(code -> body)
      }
      .handleErrorWith { error =>
        if retrySpec.retryOnConnectionError && attempt < retrySpec.maxRetries then
          F.sleep(calculateBackoffDelay(attempt, retrySpec.maxDelay)) >>
            getWithRetry(url, headers, retrySpec, attempt + 1)
        else F.raiseError(error)
      }
}

object CurlImpersonateClient:
  final case class RetrySpec(
      retryOnClientError: Boolean = false,
      retryOnServerError: Boolean = false,
      retryExcludedCodes: Set[StatusCode] = Set.empty,
      retryOnConnectionError: Boolean = false,
      maxRetries: Int = 0,
      maxDelay: FiniteDuration = 1.minute
  )

  def make[F[_]: Async](
      maxConcurrent: Int = 5,
      timeout: FiniteDuration = 30.seconds
  ): F[CurlImpersonateClient[F]] =
    Semaphore[F](maxConcurrent).map(s => LiveCurlImpersonateClient[F](s, timeout))
