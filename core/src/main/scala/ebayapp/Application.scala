package ebayapp

import cats.effect.{Blocker, ExitCode, IO, IOApp}
import ebayapp.clients.Clients
import ebayapp.common.{Logger, Resources}
import ebayapp.common.config.AppConfig
import ebayapp.controllers.Controllers
import ebayapp.repositories.Repositories
import ebayapp.services.Services
import ebayapp.tasks.Tasks
import org.http4s.server.blaze.BlazeServerBuilder
import org.http4s.implicits._

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

object Application extends IOApp {

  override def run(args: List[String]): IO[ExitCode] =
    Logger.make[IO].flatMap { implicit logger =>
      for {
        _      <- logger.info("starting ebay-app")
        config <- Blocker[IO].use(AppConfig.load[IO]) <* logger.info("loaded config")
        _ <- Resources.make[IO](config).use { resources =>
          for {
            _            <- logger.info("created resources")
            clients      <- Clients.make(config, resources.httpClientBackend) <* logger.info("created clients")
            repositories <- Repositories.make(resources.mongoClient) <* logger.info("created repositories")
            services     <- Services.make(clients, repositories) <* logger.info("created services")
            tasks        <- Tasks.make(config, services) <* logger.info("created tasks")
            controllers  <- Controllers.make(resources.blocker, services) <* logger.info("created controllers")
            runningTasks <- logger.info("initiating tasks") *> tasks.runAll.compile.drain.start
            _            <- logger.info("starting http server")
            _ <- BlazeServerBuilder[IO](ExecutionContext.global)
              .bindHttp(config.server.port, config.server.host)
              .withHttpApp(controllers.routes.orNotFound)
              .serve
              .interruptWhen(logger.awaitSigTerm)
              .compile
              .drain
              .attempt
            _ <- logger.info("stopping ebay-app")
            _ <- runningTasks.cancel *> IO.sleep(10.seconds)
          } yield ()
        }
      } yield ExitCode.Success
    }
}
