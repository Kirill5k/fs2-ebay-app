package ebayapp.monitor.clients

import io.circe.Decoder
import ebayapp.monitor.domain.Url

trait HttpClient[F[_]]:
  def get[A: Decoder](url: Url): F[Unit]


final private class LiveHttpClient[F[_]] extends HttpClient[F] {
  def get[A: Decoder](url: Url): F[Unit] = ???
}

object HttpClient {

}
