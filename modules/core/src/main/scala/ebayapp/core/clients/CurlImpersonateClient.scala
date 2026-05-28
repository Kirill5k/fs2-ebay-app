package ebayapp.core.clients

import cats.effect.Async
import sttp.model.StatusCode

import scala.sys.process.*

trait CurlImpersonateClient[F[_]]:
  def get(url: String, headers: Map[String, String]): F[(StatusCode, String)]

object CurlImpersonateClient:
  private val statusDelimiter = "---HTTP_STATUS---"

  def make[F[_]](using F: Async[F]): F[CurlImpersonateClient[F]] =
    F.pure {
      new CurlImpersonateClient[F] {
        def get(url: String, headers: Map[String, String]): F[(StatusCode, String)] =
          F.blocking {
            val headerArgs = headers.flatMap((k, v) => Seq("-H", s"$k: $v")).toSeq
            val cmd        = Seq(
              "curl_chrome116",
              "-s",
              "-L",
              "--cacert",
              "/etc/ssl/certs/ca-bundle.crt",
              "-w",
              s"\n$statusDelimiter%{http_code}"
            ) ++ headerArgs :+ url
            val output = cmd.!!
            val idx    = output.lastIndexOf(statusDelimiter)
            val code   = StatusCode(output.substring(idx + statusDelimiter.length).trim.toInt)
            val body   = output.substring(0, idx)
            (code, body)
          }
      }
    }
