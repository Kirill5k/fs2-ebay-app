package ebayapp.monitor.repositories

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import cats.syntax.traverse.*
import ebayapp.kernel.errors.AppError
import ebayapp.monitor.domain.{MonitoringEvents, Monitors}
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import mongo4cats.embedded.EmbeddedMongo
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec

import java.time.Instant
import java.time.temporal.ChronoUnit
import scala.concurrent.Future
import scala.concurrent.duration.*

class MonitoringEventRepositorySpec extends AsyncWordSpec with Matchers with EmbeddedMongo {

  "A MonitoringEventRepository" when {

    val ts = Instant.now().truncatedTo(ChronoUnit.MILLIS)

    val events = List(
      MonitoringEvents.gen(statusCheck = MonitoringEvents.statusCheck.copy(time = ts.minusSeconds(10))),
      MonitoringEvents.gen(statusCheck = MonitoringEvents.statusCheck.copy(time = ts.minusSeconds(20))),
      MonitoringEvents.gen(statusCheck = MonitoringEvents.statusCheck.copy(time = ts.minusSeconds(30)))
    )

    "store events in db and retrieve them" in withEmbeddedMongoClient { db =>
      val result = for
        repo   <- MonitoringEventRepository.make(db)
        _      <- events.traverse(repo.save)
        events <- repo.findAllBy(Monitors.id, 100)
      yield events

      result.map(_ mustBe events)
    }

    "return latest event from db" in withEmbeddedMongoClient { db =>
      val result = for
        repo  <- MonitoringEventRepository.make(db)
        _     <- IO.parTraverseN(3)(events)(repo.save)
        _     <- IO.sleep(100.millis)
        event <- repo.findLatestBy(Monitors.id)
      yield event

      result.map(_ mustBe events.headOption)
    }
  }

  def withEmbeddedMongoClient[A](test: MongoDatabase[IO] => IO[A]): Future[A] =
    withRunningEmbeddedMongo("localhost", 12146) {
      MongoClient
        .fromConnectionString[IO]("mongodb://localhost:12146")
        .evalMap(_.getDatabase("ebay-app"))
        .use(test)
    }.unsafeToFuture()(IORuntime.global)
}
