package ebayapp.proxy

import cats.effect.{Blocker, ExitCode, IO, IOApp}
import cats.implicits._
import ebayapp.proxy.common.Resources
import ebayapp.proxy.config.AppConfig
import ebayapp.proxy.controllers.Controller
import org.http4s.implicits._
import org.http4s.server.blaze.BlazeServerBuilder
import org.typelevel.log4cats.slf4j.Slf4jLogger

import scala.concurrent.ExecutionContext

object Application extends IOApp {

  implicit val logger = Slf4jLogger.getLogger[IO]

  override def run(args: List[String]): IO[ExitCode] =
    for {
      _      <- logger.info("starting ebay-app")
      config <- Blocker[IO].use(AppConfig.load[IO]) <* logger.info("loaded config")
      _ <- Resources.make[IO].use { resources =>
        for {
          _                  <- logger.info("created resources")
          redirectController <- Controller.redirect[IO](config.uris, resources.blazeClient)
          healthController   <- Controller.health[IO]
          routes = redirectController.routes <+> healthController.routes
          _                  <- logger.info("starting http server")
          _ <- BlazeServerBuilder[IO](ExecutionContext.global)
            .bindHttp(config.server.port, config.server.host)
            .withHttpApp(routes.orNotFound)
            .serve
            .compile
            .drain
        } yield ()
      }
    } yield ExitCode.Success
}
