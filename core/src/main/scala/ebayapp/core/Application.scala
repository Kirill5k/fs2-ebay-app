package ebayapp.core

import cats.effect.{ExitCode, IO, IOApp}
import ebayapp.core.clients.Clients
import ebayapp.core.common.{Logger, Resources}
import ebayapp.core.common.config.AppConfig
import ebayapp.core.controllers.Controllers
import ebayapp.core.repositories.Repositories
import ebayapp.core.services.Services
import ebayapp.core.tasks.Tasks
import org.http4s.server.blaze.BlazeServerBuilder
import org.http4s.implicits._

import scala.concurrent.ExecutionContext

object Application extends IOApp {

  val config = AppConfig.load

  override def run(args: List[String]): IO[ExitCode] =
    Logger.make[IO].flatMap { implicit logger =>
      for {
        _      <- logger.info("starting ebay-app")
        _ <- Resources.make[IO](config).use { resources =>
          for {
            _            <- logger.info("created resources")
            clients      <- Clients.make(config, resources.httpClientBackend) <* logger.info("created clients")
            repositories <- Repositories.make(resources.mongoClient) <* logger.info("created repositories")
            services     <- Services.make(clients, repositories) <* logger.info("created services")
            tasks        <- Tasks.make(config, services) <* logger.info("created tasks")
            controllers  <- Controllers.make(services) <* logger.info("created controllers")
            _            <- logger.info("initiating tasks") *> tasks.runAll.compile.drain.start
            _            <- logger.info("starting http server")
            _ <- BlazeServerBuilder[IO](ExecutionContext.global)
              .bindHttp(config.server.port, config.server.host)
              .withHttpApp(controllers.routes.orNotFound)
              .serve
              .interruptWhen(logger.awaitSigTerm)
              .compile
              .drain
          } yield ()
        }
      } yield ExitCode.Success
    }
}
