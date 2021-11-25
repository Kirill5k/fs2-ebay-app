package ebayapp.core

import cats.effect.Async
import ebayapp.core.common.config.ServerConfig
import org.http4s.implicits.*
import org.http4s.HttpRoutes
import org.http4s.blaze.server.BlazeServerBuilder
import fs2.Stream

import scala.concurrent.ExecutionContext
import scala.concurrent.duration.*

object Server:
  def serve[F[_]: Async](config: ServerConfig, routes: HttpRoutes[F], ec: ExecutionContext): Stream[F, Unit] =
    BlazeServerBuilder[F]
      .withExecutionContext(ec)
      .bindHttp(config.port, config.host)
      .withResponseHeaderTimeout(3.minutes)
      .withIdleTimeout(1.hour)
      .withHttpApp(routes.orNotFound)
      .serve
      .drain
