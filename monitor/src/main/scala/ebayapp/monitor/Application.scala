package ebayapp.monitor

import cats.effect.{IO, IOApp}
import ebayapp.monitor.actions.{ActionDispatcher, ActionProcessor}
import ebayapp.monitor.common.config.AppConfig
import ebayapp.monitor.clients.Clients
import ebayapp.monitor.repositories.Repositories
import ebayapp.monitor.services.Services
import org.typelevel.log4cats.slf4j.Slf4jLogger
import org.typelevel.log4cats.Logger
import fs2.Stream

object Application extends IOApp.Simple:
  given logger: Logger[IO] = Slf4jLogger.getLogger[IO]
  override val run: IO[Unit] =
    for
      config <- logger.info("loading a config") *> AppConfig.load[IO]
      _ <- Resources.make[IO](config).use { resources =>
        for
          _               <- logger.info("created resources")
          clients         <- Clients.make(resources) <* logger.info("created clients")
          dispatcher      <- ActionDispatcher.make[IO] <* logger.info("created action dispatchers")
          repositories    <- Repositories.make(resources.database) <* logger.info("created repositories")
          services        <- Services.make(dispatcher, clients, repositories) <* logger.info("created services")
          actionProcessor <- ActionProcessor.make(dispatcher, services) <* logger.info("created action processor")
          _               <- Stream(actionProcessor.process, services.monitoringEvent.process).parJoinUnbounded.compile.drain
        yield ()
      }
    yield ()
