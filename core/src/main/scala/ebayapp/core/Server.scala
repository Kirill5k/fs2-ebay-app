package ebayapp.core

import cats.effect.Async
import ebayapp.core.common.config.ServerConfig
import org.http4s.implicits._
import org.http4s.HttpRoutes
import org.http4s.blaze.server.BlazeServerBuilder
import fs2.Stream

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

object Server {

  def build[F[_]: Async](config: ServerConfig, routes: HttpRoutes[F], ec: ExecutionContext): Stream[F, Unit] =
    BlazeServerBuilder[F](ec)
      .bindHttp(config.port, config.host)
      .withResponseHeaderTimeout(3.minutes)
      .withIdleTimeout(1.hour)
      .withHttpApp(routes.orNotFound)
      .serve
      .drain
}
