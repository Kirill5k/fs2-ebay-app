package io.github.kirill5k.ebayapp

import cats.effect.{Blocker, ExitCode, IO, IOApp}
import io.chrisdavenport.log4cats.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.github.kirill5k.ebayapp.common.config.AppConfig

object Application extends IOApp {

  implicit val logger: Logger[IO] = Slf4jLogger.getLogger[IO]

  override def run(args: List[String]): IO[ExitCode] =
    for {
      _      <- logger.info("starting ebay-app")
      config <- Blocker[IO].use(AppConfig.load[IO])
      _      <- logger.info("loaded config")
      _ <- Resources.make[IO](config).use { _ =>
        for {
          _ <- logger.info("created resources")
        } yield ()
      }
    } yield ExitCode.Success
}
