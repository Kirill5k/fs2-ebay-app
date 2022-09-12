package ebayapp.proxy

import cats.effect.{IO, IOApp}
import cats.syntax.semigroupk.*
import ebayapp.kernel.Server
import ebayapp.kernel.controllers.HealthController
import ebayapp.proxy.common.{Interrupter, Resources}
import ebayapp.proxy.common.config.AppConfig
import ebayapp.proxy.controllers.RedirectController
import org.http4s.server.middleware.RequestLogger
import org.typelevel.log4cats.slf4j.Slf4jLogger
import org.typelevel.log4cats.Logger

object Application extends IOApp.Simple:
  given logger: Logger[IO] = Slf4jLogger.getLogger[IO]
  override val run: IO[Unit] =
    for
      _      <- logger.info("starting ebay-app-proxy")
      config <- logger.info("loading config") *> AppConfig.load[IO]
      _ <- logger.info("creating resources") *> Resources.make[IO](config).use { resources =>
        for
          interrupter        <- Interrupter.make[IO](config.interrupter)
          redirectController <- RedirectController.make[IO](resources, interrupter)
          healthController   <- HealthController.make[IO]
          routes = (healthController.routes <+> redirectController.routes)
          _ <- logger.info("starting http server") *> Server
            .serve[IO](config.server, RequestLogger.httpRoutes(true, true)(routes), runtime.compute)
            .interruptWhen(interrupter.awaitSigTerm)
            .compile
            .drain
        yield ()
      }
    yield ()
