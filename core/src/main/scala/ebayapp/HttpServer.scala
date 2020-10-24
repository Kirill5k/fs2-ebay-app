package ebayapp

import cats.effect.{ConcurrentEffect, ContextShift, ExitCode, Fiber, Resource, Sync, Timer}
import cats.effect.implicits._
import cats.implicits._
import ebayapp.common.config.ServerConfig
import org.http4s.HttpRoutes
import org.http4s.implicits._
import org.http4s.server._
import org.http4s.server.blaze.BlazeServerBuilder
import org.http4s.server.middleware._

import scala.concurrent.ExecutionContext

final class HttpServer[F[_]: ConcurrentEffect: Timer: ContextShift](
    private val server: Resource[F, Server[F]]
) {

  def start(): F[Fiber[F, ExitCode]] =
    server
      .use(_ => ConcurrentEffect[F].never[Server[F]])
      .as(ExitCode.Success)
      .start
}

object HttpServer {

  def make[F[_]: ConcurrentEffect: Timer: ContextShift](
      config: ServerConfig,
      routes: HttpRoutes[F],
      execContext: ExecutionContext
  ): F[HttpServer[F]] = {
    val server = BlazeServerBuilder[F](execContext)
      .bindHttp(config.port, config.host)
      .withHttpApp(CORS(routes).orNotFound)
      .resource

    Sync[F].delay(new HttpServer[F](server))
  }
}
