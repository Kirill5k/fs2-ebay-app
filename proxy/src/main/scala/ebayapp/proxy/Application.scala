package ebayapp.proxy

import cats.effect.kernel.Deferred
import cats.effect.{IO, IOApp}
import cats.syntax.semigroupk._
import ebayapp.proxy.common.Resources
import ebayapp.proxy.common.config.AppConfig
import ebayapp.proxy.controllers.Controller
import org.http4s.implicits._
import org.http4s.blaze.server.BlazeServerBuilder
import org.typelevel.log4cats.slf4j.Slf4jLogger

import scala.concurrent.duration._

object Application extends IOApp.Simple {

  implicit val logger = Slf4jLogger.getLogger[IO]

  val config = AppConfig.load

  override val run: IO[Unit] =
    logger.info("starting ebay-app-proxy") *>
      Resources.make[IO].use { resources =>
        for {
          _                  <- logger.info("created resources")
          sigTerm            <- Deferred[IO, Unit]
          redirectController <- Controller.redirect[IO](resources.blazeClient, sigTerm)
          healthController   <- Controller.health[IO]
          routes = redirectController.routes <+> healthController.routes
          _ <- logger.info("starting http server")
          _ <- BlazeServerBuilder[IO]
            .withExecutionContext(runtime.compute)
            .bindHttp(config.server.port, config.server.host)
            .withResponseHeaderTimeout(3.minutes)
            .withIdleTimeout(1.hour)
            .withHttpApp(routes.orNotFound)
            .serve
            .interruptWhen(sigTerm.get.attempt)
            .compile
            .drain
        } yield ()
      }
}
