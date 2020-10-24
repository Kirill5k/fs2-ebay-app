package ebayapp

import cats.effect.{Blocker, ExitCode, IO, IOApp}
import ebayapp.clients.Clients
import io.chrisdavenport.log4cats.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import ebayapp.common.config.AppConfig
import ebayapp.repositories.Repositories
import ebayapp.services.Services
import ebayapp.tasks.Tasks

object Application extends IOApp {

  implicit val logger: Logger[IO] = Slf4jLogger.getLogger[IO]

  override def run(args: List[String]): IO[ExitCode] =
    for {
      _      <- logger.info("starting ebay-app")
      config <- Blocker[IO].use(AppConfig.load[IO]) <* logger.info("loaded config")
      _ <- Resources.make[IO](config).use { resources =>
        for {
          _            <- logger.info("created resources")
          clients      <- Clients.make(config, resources.httpClientBackend) <* logger.info("created clients")
          repositories <- Repositories.make(resources.mongoClient) <* logger.info("created repositories")
          services     <- Services.make(config, clients, repositories) <* logger.info("created services")
          _            <- Tasks.make(config, services) <* logger.info("created tasks")
        } yield ()
      }
    } yield ExitCode.Success
}
