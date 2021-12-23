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

import scala.concurrent.Future

class MonitorRepositorySpec extends AsyncWordSpec with Matchers with EmbeddedMongo {

  "A MonitorRepository" when {

    "getAllActive" should {
      "return empty list when there are no active monitor" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          _    <- repo.save(Monitors.gen(active = false))
          mons <- repo.getAllActive
        yield mons

        result.map(_ mustBe Nil)
      }

      "return active monitors" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          _    <- repo.save(Monitors.gen())
          mons <- repo.getAllActive
        yield mons

        result.map(_ mustBe List(Monitors.gen()))
      }
    }

    "pause" should {
      "change status to inactive" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          _    <- repo.save(Monitors.gen())
          _    <- repo.pause(Monitors.id)
          mon  <- repo.find(Monitors.id)
        yield mon

        result.map(_.active mustBe false)
      }

      "return error when monitor does not exist" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          res  <- repo.pause(Monitors.id).attempt
        yield res

        result.map(_ mustBe Left(AppError.MonitorNotFound(Monitors.id)))
      }
    }

    "unpause" should {
      "change status to inactive" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          _    <- repo.save(Monitors.gen(active = false))
          _    <- repo.unpause(Monitors.id)
          mon  <- repo.find(Monitors.id)
        yield mon

        result.map(_.active mustBe true)
      }

      "return error when monitor does not exist" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          res  <- repo.unpause(Monitors.id).attempt
        yield res

        result.map(_ mustBe Left(AppError.MonitorNotFound(Monitors.id)))
      }
    }

    "delete" should {
      "remove monitor by id" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          _    <- repo.save(Monitors.gen())
          res  <- repo.delete(Monitors.id)
        yield res

        result.map(_ mustBe ())
      }

      "return error when monitor does not exist" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          res  <- repo.delete(Monitors.id).attempt
        yield res

        result.map(_ mustBe Left(AppError.MonitorNotFound(Monitors.id)))
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
