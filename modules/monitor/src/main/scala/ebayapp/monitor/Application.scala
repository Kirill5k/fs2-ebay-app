package ebayapp.monitor

import cats.effect.{IO, IOApp}
import kirill5k.common.http4s.Server
import ebayapp.monitor.actions.{Action, ActionDispatcher, ActionProcessor}
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
      _      <- logger.info(s"starting ebay-app-monitor ${sys.env.getOrElse("VERSION", "")}")
      config <- logger.info("loading config") *> AppConfig.load[IO]
      _ <- Resources.make[IO](config).use { resources =>
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
            Stream.eval(dispatcher.dispatch(Action.RescheduleAll)),
            Server.serveEmber[IO](config.server, controllers.routes),
            actionProcessor.process
          ).parJoinUnbounded.compile.drain
        yield ()
      }
    yield ()
