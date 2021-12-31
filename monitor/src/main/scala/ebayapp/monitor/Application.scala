package ebayapp.monitor

import cats.effect.{IO, IOApp}
import ebayapp.kernel.Server
import ebayapp.monitor.actions.{ActionDispatcher, ActionProcessor, Action}
import ebayapp.monitor.common.config.AppConfig
import ebayapp.monitor.clients.Clients
import ebayapp.monitor.controllers.Controllers
import ebayapp.monitor.repositories.Repositories
import ebayapp.monitor.services.Services
import org.typelevel.log4cats.slf4j.Slf4jLogger
import org.typelevel.log4cats.Logger
import fs2.Stream

object Application extends IOApp.Simple:
  given logger: Logger[IO] = Slf4jLogger.getLogger[IO]
  override val run: IO[Unit] =
    for
      _      <- logger.info("starting ebay-app-monitor")
      config <- logger.info("loading config") *> AppConfig.load[IO]
      _ <- Resources.make[IO](config, runtime.compute).use { resources =>
        for
          _               <- logger.info("created resources")
          clients         <- Clients.make(resources) <* logger.info("created clients")
          dispatcher      <- ActionDispatcher.make[IO] <* logger.info("created action dispatchers")
          repositories    <- Repositories.make(resources.database) <* logger.info("created repositories")
          services        <- Services.make(dispatcher, clients, repositories) <* logger.info("created services")
          actionProcessor <- ActionProcessor.make(dispatcher, services) <* logger.info("created action processor")
          controllers     <- Controllers.make[IO](services) <* logger.info("created controllers")
          _               <- logger.info("starting http server and processors")
          _ <- Stream(
            Stream.eval(dispatcher.dispatch(Action.EnqueueAll)),
            Server.serve[IO](config.server, controllers.routes, runtime.compute),
            actionProcessor.process,
            services.process
          ).parJoinUnbounded.compile.drain
        yield ()
      }
    yield ()
