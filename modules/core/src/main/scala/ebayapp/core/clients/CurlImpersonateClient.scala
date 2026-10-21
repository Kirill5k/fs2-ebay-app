package ebayapp.core.clients

import cats.effect.Async
import cats.effect.std.Semaphore
import cats.syntax.applicativeError.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.kernel.errors.AppError
import io.circe.Decoder
import io.circe.parser.decode
import kirill5k.common.cats.syntax.sync.*
import sttp.model.StatusCode
import CurlImpersonateClient.{CommandResult, RetrySpec}

import java.io.IOException
import scala.concurrent.duration.*
import scala.util.Random

trait CurlImpersonateClient[F[_]]:
  def get(url: String, headers: Map[String, String], retrySpec: RetrySpec = RetrySpec()): F[(StatusCode, String)]
  def getAs[A: Decoder](url: String, headers: Map[String, String], retrySpec: RetrySpec = RetrySpec()): F[(StatusCode, A)]
  def post(url: String, headers: Map[String, String], body: String, retrySpec: RetrySpec = RetrySpec()): F[(StatusCode, String)]

final private class LiveCurlImpersonateClient[F[_]](
    private val semaphore: Semaphore[F],
    private val timeout: FiniteDuration,
    private val execute: List[String] => F[CommandResult]
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

  override def get(url: String, headers: Map[String, String], retrySpec: RetrySpec = RetrySpec.Default): F[(StatusCode, String)] =
    requestWithRetry(command(url, headers, None), retrySpec, attempt = 0)

  override def post(
      url: String,
      headers: Map[String, String],
      body: String,
      retrySpec: RetrySpec = RetrySpec.Default
  ): F[(StatusCode, String)] =
    requestWithRetry(command(url, headers, Some(body)), retrySpec, attempt = 0)

  override def getAs[A: Decoder](url: String, headers: Map[String, String], retrySpec: RetrySpec = RetrySpec.Default): F[(StatusCode, A)] =
    for
      (code, body) <- get(url, headers, retrySpec)
      decoded      <- F.fromEither(decode[A](body).left.map(e => AppError.Json(e.getMessage, body)))
    yield code -> decoded

  private def command(url: String, headers: Map[String, String], body: Option[String]): List[String] = {
    val headerArgs = headers.flatMap((k, v) => List("-H", s"$k: $v")).toList
    val bodyArgs   = body.toList.flatMap(value => List("--data-raw", value))
    curlCmd ++ headerArgs ++ bodyArgs :+ url
  }

  private def requestWithRetry(command: List[String], retrySpec: RetrySpec, attempt: Int): F[(StatusCode, String)] =
    semaphore.permit
      .surround {
        for
          result <- execute(command)
          _      <- F.raiseWhen(result.exitCode != 0)(new IOException(s"curl failed (exit ${result.exitCode}): ${result.stderr}"))
          idx = result.stdout.lastIndexOf(statusDelimiter)
          _    <- F.raiseWhen(idx < 0)(new IOException("curl response is missing HTTP status"))
          code <- F.fromOption(
            result.stdout.substring(idx + statusDelimiter.length).trim.toIntOption,
            new IOException("curl response has invalid HTTP status")
          )
        yield StatusCode(code) -> result.stdout.substring(0, idx)
      }
      .attempt
      .flatMap {
        case Right((code, body)) =>
          val shouldRetry =
            (retrySpec.retryOnClientError && code.isClientError || retrySpec.retryOnServerError && code.isServerError) &&
              !retrySpec.retryExcludedCodes.contains(code) &&
              attempt < retrySpec.maxRetries
          if shouldRetry then
            F.sleep(calculateBackoffDelay(attempt, retrySpec.maxDelay)) >>
              requestWithRetry(command, retrySpec, attempt + 1)
          else F.pure(code -> body)
        case Left(error) =>
          if retrySpec.retryOnConnectionError && attempt < retrySpec.maxRetries then
            F.sleep(calculateBackoffDelay(attempt, retrySpec.maxDelay)) >>
              requestWithRetry(command, retrySpec, attempt + 1)
          else F.raiseError(error)
      }
}

object CurlImpersonateClient:
  final private[clients] case class CommandResult(exitCode: Int, stdout: String, stderr: String)

  final case class RetrySpec(
      retryOnClientError: Boolean = false,
      retryOnServerError: Boolean = false,
      retryExcludedCodes: Set[StatusCode] = Set.empty,
      retryOnConnectionError: Boolean = false,
      maxRetries: Int = 0,
      maxDelay: FiniteDuration = 1.minute
  )

  object RetrySpec:
    val Default = RetrySpec(
      retryOnClientError = true,
      retryOnServerError = true,
      retryOnConnectionError = true,
      maxRetries = 3,
      maxDelay = 1.minute
    )

  def make[F[_]: Async](
      maxConcurrent: Int = 5,
      timeout: FiniteDuration = 30.seconds
  ): F[CurlImpersonateClient[F]] =
    withExecutor[F](
      command => Async[F].cmd(command).map(result => CommandResult(result.exitCode, result.stdout, result.stderr)),
      maxConcurrent,
      timeout
    )

  private[clients] def withExecutor[F[_]: Async](
      execute: List[String] => F[CommandResult],
      maxConcurrent: Int = 5,
      timeout: FiniteDuration = 30.seconds
  ): F[CurlImpersonateClient[F]] =
    Semaphore[F](maxConcurrent).map(s => LiveCurlImpersonateClient[F](s, timeout, execute))
