package ebayapp.core

import cats.effect.{IO, IOApp}
import kirill5k.common.http4s.Server
import ebayapp.core.clients.Clients
import ebayapp.core.common.config.AppConfig
import ebayapp.core.common.{RetailConfigProvider, Logger, Resources}
import ebayapp.core.controllers.Controllers
import ebayapp.core.repositories.Repositories
import ebayapp.core.services.Services
import ebayapp.core.tasks.Tasks

object Application extends IOApp.Simple:
  override val run: IO[Unit] =
    Logger.make[IO].flatMap { implicit logger =>
      for
        _         <- logger.info(s"starting ebay-app-core ${sys.env.getOrElse("VERSION", "")}")
        appConfig <- logger.info("loading app config") *> AppConfig.loadDefault[IO]
        _ <- Resources.make[IO](appConfig).use { resources =>
          for
            _              <- logger.info("created resources")
            repositories   <- Repositories.make(resources.database) <* logger.info("created repositories")
            configProvider <- logger.info("initialising config provider") *> RetailConfigProvider.make[IO]()
            clients        <- Clients.make(configProvider, resources) <* logger.info("created clients")
            services       <- Services.make(configProvider, clients, repositories) <* logger.info("created services")
            tasks          <- Tasks.make(services) <* logger.info("created tasks")
            controllers    <- Controllers.make(services) <* logger.info("created controllers")
            _ <- logger.info("starting http server") *> Server
              .serveEmber[IO](appConfig.server, controllers.routes)
              .concurrently(tasks.runAll)
              .interruptWhen(logger.awaitSigTerm)
              .compile
              .drain
          yield ()
        }
      yield ()
    }
