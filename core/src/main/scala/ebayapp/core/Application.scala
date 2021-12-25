package ebayapp.core

import cats.effect.{IO, IOApp}
import ebayapp.kernel.Server
import ebayapp.core.clients.Clients
import ebayapp.core.common.{Logger, Resources}
import ebayapp.core.common.config.AppConfig
import ebayapp.core.controllers.Controllers
import ebayapp.core.repositories.Repositories
import ebayapp.core.services.Services
import ebayapp.core.tasks.Tasks

object Application extends IOApp.Simple:
  override val run: IO[Unit] =
    Logger.make[IO].flatMap { implicit logger =>
      for
        _      <- logger.info("starting ebay-app-core")
        config <- logger.info("loading config") *> AppConfig.load[IO]
        _ <- Resources.make[IO](config).use { resources =>
          for
            _            <- logger.info("created resources")
            clients      <- Clients.make(config, resources) <* logger.info("created clients")
            repositories <- Repositories.make(resources.database) <* logger.info("created repositories")
            services     <- Services.make(config, clients, repositories) <* logger.info("created services")
            tasks        <- Tasks.make(services) <* logger.info("created tasks")
            controllers  <- Controllers.make(services) <* logger.info("created controllers")
            _ <- logger.info("starting http server") *> Server
              .serve[IO](config.server, controllers.routes, runtime.compute)
              .concurrently(tasks.runAll)
              .interruptWhen(logger.awaitSigTerm)
              .compile
              .drain
          yield ()
        }
      yield ()
    }
