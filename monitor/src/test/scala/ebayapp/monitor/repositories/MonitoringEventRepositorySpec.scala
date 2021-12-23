package ebayapp.monitor.repositories

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.monitor.common.errors.AppError
import ebayapp.monitor.domain.{MonitoringEvents, Monitors}
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import mongo4cats.embedded.EmbeddedMongo
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec

import scala.concurrent.Future

class MonitoringEventRepositorySpec extends AsyncWordSpec with Matchers with EmbeddedMongo {

  "A MonitoringEventRepository" when {

    "store events in db and retrieve them" in withEmbeddedMongoClient { db =>
      val result = for
        repo <- MonitoringEventRepository.make(db)
        _    <- repo.save(MonitoringEvents.gen())
        _    <- repo.save(MonitoringEvents.gen())
        _    <- repo.save(MonitoringEvents.gen())
        events <- repo.findAllBy(Monitors.id)
      yield events

      result.map(_ must have size 3)
    }
  }

  def withEmbeddedMongoClient[A](test: MongoDatabase[IO] => IO[A]): Future[A] =
    withRunningEmbeddedMongo("localhost", 12146) {
      MongoClient
        .fromConnectionString[IO]("mongodb://localhost:12246")
        .evalMap(_.getDatabase("ebay-app"))
        .use(test)
    }.unsafeToFuture()(IORuntime.global)
}
