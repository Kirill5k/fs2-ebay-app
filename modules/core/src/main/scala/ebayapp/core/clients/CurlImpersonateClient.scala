package ebayapp.core.clients

import cats.effect.Async
import cats.effect.std.Semaphore
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import kirill5k.common.cats.syntax.sync.*
import sttp.model.StatusCode

import java.io.IOException

trait CurlImpersonateClient[F[_]]:
  def get(url: String, headers: Map[String, String]): F[(StatusCode, String)]

object CurlImpersonateClient {
  private val statusDelimiter = "---HTTP_STATUS---"
  private val maxConcurrent   = 5
  private val maxTimeSeconds  = 30

  private val curlCmd = List(
    "curl_chrome116",
    "-s",
    "-L",
    "--max-time", maxTimeSeconds.toString,
    "--cacert", "/etc/ssl/certs/ca-bundle.crt",
    "-w", s"\n$statusDelimiter%{http_code}"
  )
  
  def make[F[_]](using F: Async[F]): F[CurlImpersonateClient[F]] =
    Semaphore[F](maxConcurrent).map { semaphore =>
      new CurlImpersonateClient[F]:
        def get(url: String, headers: Map[String, String]): F[(StatusCode, String)] =
          semaphore.permit.surround {
            for
              headerArgs = headers.flatMap((k, v) => List("-H", s"$k: $v")).toList
              result <- F.cmd(curlCmd ++ headerArgs :+ url)
              _      <- F.raiseWhen(result.exitCode != 0)(new IOException(s"curl failed (exit ${result.exitCode}): ${result.stderr}"))
              idx  = result.stdout.lastIndexOf(statusDelimiter)
              code = StatusCode(result.stdout.substring(idx + statusDelimiter.length).trim.toInt)
              body = result.stdout.substring(0, idx)
            yield code -> body
          }
    }
}
