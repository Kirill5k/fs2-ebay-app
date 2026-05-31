package ebayapp.core.clients

import cats.effect.{Async, Sync}
import cats.effect.std.Semaphore
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import kirill5k.common.cats.syntax.sync.*
import sttp.model.StatusCode

import java.io.IOException
import scala.concurrent.duration.*

trait CurlImpersonateClient[F[_]]:
  def get(url: String, headers: Map[String, String]): F[(StatusCode, String)]

final private class LiveCurlImpersonateClient[F[_]](
    private val semaphore: Semaphore[F],
    private val timeout: FiniteDuration
)(using
    F: Sync[F]
) extends CurlImpersonateClient[F] {

  private val statusDelimiter = "---HTTP_STATUS---"

  private val curlCmd = List(
    "curl_chrome116",
    "-s",
    "-L",
    "--max-time", timeout.toSeconds.toString,
    "--cacert", "/etc/ssl/certs/ca-bundle.crt",
    "-w", s"\n$statusDelimiter%{http_code}"
  )

  override def get(url: String, headers: Map[String, String]): F[(StatusCode, String)] =
    semaphore.permit.surround {
      for
        headerArgs = headers.flatMap((k, v) => List("-H", s"$k: $v")).toList
        result <- F.cmd(curlCmd ++ headerArgs :+ url)
        _      <- F.raiseWhen(result.isError)(new IOException(s"curl failed (exit ${result.exitCode}): ${result.stderr}"))
        idx  = result.stdout.lastIndexOf(statusDelimiter)
        code = StatusCode(result.stdout.substring(idx + statusDelimiter.length).trim.toInt)
        body = result.stdout.substring(0, idx)
      yield code -> body
    }
}

object CurlImpersonateClient:
  def make[F[_]](
      maxConcurrent: Int = 5,
      timeout: FiniteDuration = 30.seconds
  )(using F: Async[F]): F[CurlImpersonateClient[F]] =
    Semaphore[F](maxConcurrent).map(s => LiveCurlImpersonateClient[F](s, timeout))
