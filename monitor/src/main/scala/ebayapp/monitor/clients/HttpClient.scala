package ebayapp.monitor.clients

import ebayapp.monitor.domain.{HttpMethod, Url}

import scala.concurrent.duration.FiniteDuration

trait HttpClient[F[_]]:
  def status(method: HttpMethod, url: Url, timeout: FiniteDuration): F[Unit]


final private class LiveHttpClient[F[_]] extends HttpClient[F] {
  def status(method: HttpMethod, url: Url, timeout: FiniteDuration): F[Unit] = ???
}

object HttpClient {

}
