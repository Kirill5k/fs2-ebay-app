package ebayapp.kernel

import cats.effect.Async
import com.comcast.ip4s.*
import ebayapp.kernel.config.ServerConfig
import org.http4s.HttpRoutes
import org.http4s.ember.server.EmberServerBuilder
import fs2.Stream
import fs2.io.net.Network

import scala.concurrent.duration.*

object Server:
  def serve[F[_]](config: ServerConfig, routes: HttpRoutes[F])(using F: Async[F]): Stream[F, Unit] =
    Stream.eval {
      EmberServerBuilder
        .default(F, Network.forAsync[F])
        .withHost(Ipv4Address.fromString(config.host).get)
        .withPort(Port.fromInt(config.port).get)
        .withHttpApp(routes.orNotFound)
        .withIdleTimeout(1.hour)
        .build
        .use(_ => Async[F].never)
    }.drain
