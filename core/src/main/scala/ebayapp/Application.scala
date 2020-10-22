package ebayapp

import cats.effect.{Blocker, ExitCode, IO, IOApp}
import ebayapp.clients.Clients
import io.chrisdavenport.log4cats.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import ebayapp.common.config.AppConfig

object Application extends IOApp {

  implicit val logger: Logger[IO] = Slf4jLogger.getLogger[IO]

  override def run(args: List[String]): IO[ExitCode] =
    for {
      _      <- logger.info("starting ebay-app")
      config <- Blocker[IO].use(AppConfig.load[IO])
      _      <- logger.info("loaded config")
      _ <- Resources.make[IO](config).use { resources =>
        for {
          _ <- logger.info("created resources")
          _ <- Clients.make(config, resources.httpClientBackend)
          _ <- logger.info("created clients")
        } yield ()
      }
    } yield ExitCode.Success
}
