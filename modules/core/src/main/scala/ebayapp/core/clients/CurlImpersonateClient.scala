package ebayapp.core.clients

import cats.effect.Async
import cats.effect.std.Semaphore
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import sttp.model.StatusCode

import java.io.{ByteArrayOutputStream, IOException}
import scala.sys.process.*

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
    "--max-time",
    maxTimeSeconds.toString,
    "--cacert",
    "/etc/ssl/certs/ca-bundle.crt",
    "-w",
    s"\n$statusDelimiter%{http_code}"
  )

  private def outputToResponse(stdout: ByteArrayOutputStream): (StatusCode, String) = {
    val output = stdout.toString("UTF-8")
    val idx    = output.lastIndexOf(statusDelimiter)
    val code   = StatusCode(output.substring(idx + statusDelimiter.length).trim.toInt)
    val body   = output.substring(0, idx)
    (code, body)
  }

  def make[F[_]](using F: Async[F]): F[CurlImpersonateClient[F]] =
    Semaphore[F](maxConcurrent).map { semaphore =>
      new CurlImpersonateClient[F]:
        def get(url: String, headers: Map[String, String]): F[(StatusCode, String)] =
          semaphore.permit.surround {
            F.blocking {
              val stdout     = new ByteArrayOutputStream()
              val stderr     = new ByteArrayOutputStream()
              val headerArgs = headers.flatMap((k, v) => List("-H", s"$k: $v")).toList
              val cmd        = curlCmd ++ headerArgs :+ url
              val exitCode   = cmd.!(
                ProcessLogger(
                  out => stdout.write((out + "\n").getBytes),
                  err => stderr.write((err + "\n").getBytes)
                )
              )

              Either.cond(
                exitCode == 0,
                outputToResponse(stdout),
                new IOException(s"curl failed (exit $exitCode): ${stderr.toString("UTF-8").trim}")
              )
            }.flatMap(F.fromEither)
          }
    }
}
