package io.github.kirill5k.ebayapp

import cats.effect.{ExitCode, IO, IOApp}
import io.chrisdavenport.log4cats.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.github.kirill5k.ebayapp.common.config.AppConfig

object Application extends IOApp {

  implicit val logger: Logger[IO] = Slf4jLogger.getLogger[IO]

  override def run(args: List[String]): IO[ExitCode] =
    Resources.make[IO].use { res =>
      for {
        _ <- logger.info("starting ebay-app")
        _ <- AppConfig.load[IO](res.blocker)
        _ <- logger.info("loaded config")
      } yield ExitCode.Success
    }
}
