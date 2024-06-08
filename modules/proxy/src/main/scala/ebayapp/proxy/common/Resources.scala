package ebayapp.proxy.common

import cats.effect.{Async, Resource}
import ebayapp.kernel.config.ClientConfig
import ebayapp.proxy.common.config.AppConfig
import fs2.io.net.Network
import org.http4s.client.Client
import org.http4s.client.middleware.FollowRedirect
import org.http4s.ember.client.EmberClientBuilder

import scala.concurrent.duration.*

trait Resources[F[_]]:
  def emberClient: Client[F]

object Resources:

  def make[F[_]: Async](config: AppConfig): Resource[F, Resources[F]] =
    makeEmberClient[F](config.client)map { ember =>
      new Resources[F] {
        def emberClient: Client[F]   = FollowRedirect(10)(ember)
      }
    }

  private def makeEmberClient[F[_]](config: ClientConfig)(using F: Async[F]): Resource[F, Client[F]] =
    EmberClientBuilder
      .default[F](using F, Network.forAsync[F])
      .withMaxTotal(256 * 10)
      .withTimeout(config.connectTimeout)
      .withIdleConnectionTime(Duration.Inf)
      .build
