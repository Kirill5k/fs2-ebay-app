package ebayapp.monitor.repositories

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.monitor.common.errors.AppError
import ebayapp.monitor.domain.Monitors
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import mongo4cats.embedded.EmbeddedMongo
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers
import org.scalatest.OptionValues

import scala.concurrent.Future

class MonitorRepositorySpec extends AsyncWordSpec with Matchers with EmbeddedMongo with OptionValues {

  "A MonitorRepository" when {

    "getAllActive" should {
      "return active monitors" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          mon  <- repo.save(Monitors.create())
          mons <- repo.getAllActive
        yield (mon, mons)

        result.map { case (mon, mons) =>
          mons mustBe List(mon)
        }
      }

      "return empty list when there are no active monitor" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          mon  <- repo.save(Monitors.create())
          _    <- repo.pause(mon.id)
          mons <- repo.getAllActive
        yield mons

        result.map(_ mustBe Nil)
      }
    }

    "pause" should {
      "change status to inactive" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          mon  <- repo.save(Monitors.create())
          _    <- repo.pause(mon.id)
          mon  <- repo.find(mon.id)
        yield mon

        result.map(_.value.active mustBe false)
      }
    }

    "unpause" should {
      "change status to inactive" in withEmbeddedMongoClient { db =>
        val result = for
          repo   <- MonitorRepository.make(db)
          newMon <- repo.save(Monitors.create())
          _      <- repo.pause(newMon.id)
          _      <- repo.unpause(newMon.id)
          mon    <- repo.find(newMon.id)
        yield mon

        result.map(_.value.active mustBe true)
      }
    }

    "delete" should {
      "remove monitor by id" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          mon  <- repo.save(Monitors.create())
          _    <- repo.delete(mon.id)
          res  <- repo.find(mon.id)
        yield res

        result.map(_ mustBe None)
      }
    }
  }

  def withEmbeddedMongoClient[A](test: MongoDatabase[IO] => IO[A]): Future[A] =
    withRunningEmbeddedMongo("localhost", 12246) {
      MongoClient
        .fromConnectionString[IO]("mongodb://localhost:12246")
        .evalMap(_.getDatabase("ebay-app"))
        .use(test)
    }.unsafeToFuture()(IORuntime.global)
}
