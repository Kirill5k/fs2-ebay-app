package ebayapp.core

import cats.effect.{IO, IOApp}
import kirill5k.common.http4s.Server
import ebayapp.core.clients.Clients
import ebayapp.core.common.{ConfigProvider, Logger, Resources}
import ebayapp.core.controllers.Controllers
import ebayapp.core.repositories.Repositories
import ebayapp.core.services.Services
import ebayapp.core.tasks.Tasks

object Application extends IOApp.Simple:
  override val run: IO[Unit] =
    Logger.make[IO].flatMap { implicit logger =>
      for
        _              <- logger.info(s"starting ebay-app-core ${sys.env.getOrElse("VERSION", "")}")
        configProvider <- logger.info("initialising config") *> ConfigProvider.make[IO]()
        config         <- configProvider.config
        _ <- Resources.make[IO](config).use { resources =>
          for
            _            <- logger.info("created resources")
            clients      <- Clients.make(configProvider, resources) <* logger.info("created clients")
            repositories <- Repositories.make(resources.database) <* logger.info("created repositories")
            services     <- Services.make(configProvider, clients, repositories) <* logger.info("created services")
            tasks        <- Tasks.make(services) <* logger.info("created tasks")
            controllers  <- Controllers.make(services) <* logger.info("created controllers")
            _ <- logger.info("starting http server") *> Server
              .serveEmber[IO](config.server, controllers.routes)
              .concurrently(tasks.runAll)
              .interruptWhen(logger.awaitSigTerm)
              .compile
              .drain
          yield ()
        }
      yield ()
    }
