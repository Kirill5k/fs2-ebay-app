package ebayapp.proxy

import cats.effect.kernel.Deferred
import cats.effect.{IO, IOApp}
import cats.syntax.semigroupk.*
import ebayapp.kernel.controllers.HealthController
import ebayapp.proxy.common.{Interrupter, Resources}
import ebayapp.proxy.common.config.AppConfig
import ebayapp.proxy.controllers.RedirectController
import org.http4s.blaze.server.BlazeServerBuilder
import org.typelevel.log4cats.SelfAwareStructuredLogger
import org.typelevel.log4cats.slf4j.Slf4jLogger
import org.typelevel.log4cats.Logger

import scala.concurrent.duration.*

object Application extends IOApp.Simple:
  given logger: Logger[IO] = Slf4jLogger.getLogger[IO]
  override val run: IO[Unit] =
    logger.info("starting ebay-app-proxy") *>
      Resources.make[IO].use { resources =>
        for
          _                  <- logger.info("created resources")
          config             <- AppConfig.load[IO] <* logger.info("loaded config")
          interrupter        <- Interrupter.make[IO]
          redirectController <- RedirectController.make[IO](resources.blazeClient, interrupter)
          healthController   <- HealthController.make[IO]
          routes = healthController.routes <+> redirectController.routes
          _ <- logger.info("starting http server")
          _ <- BlazeServerBuilder[IO]
            .withExecutionContext(runtime.compute)
            .bindHttp(config.server.port, config.server.host)
            .withResponseHeaderTimeout(3.minutes)
            .withIdleTimeout(1.hour)
            .withHttpApp(routes.orNotFound)
            .serve
            .interruptWhen(interrupter.awaitSigTerm)
            .compile
            .drain
        yield ()
      }
