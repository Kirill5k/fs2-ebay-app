package ebayapp.monitor.repositories

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.kernel.errors.AppError
import ebayapp.monitor.domain.{Monitors, Monitor}
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import mongo4cats.embedded.EmbeddedMongo
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers
import org.scalatest.OptionValues

import scala.concurrent.Future

class MonitorRepositorySpec extends AsyncWordSpec with Matchers with EmbeddedMongo with OptionValues {

  "A MonitorRepository" when {

    "getAll" should {
      "return all monitors" in withEmbeddedMongoClient { db =>
        for
          repo <- MonitorRepository.make(db)
          mon1 <- repo.save(Monitors.create())
          mon2 <- repo.save(Monitors.create())
          mons <- repo.getAllActive
        yield mons mustBe List(mon1, mon2)
      }
    }

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

      "allow pausing monitor multiple times in the row" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          mon  <- repo.save(Monitors.create())
          _    <- repo.pause(mon.id)
          _    <- repo.pause(mon.id)
          _    <- repo.pause(mon.id)
          _    <- repo.pause(mon.id)
          mon  <- repo.find(mon.id)
        yield mon

        result.map(_.value.active mustBe false)
      }

      "return error when monitor does not exist" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          res  <- repo.pause(Monitors.id).attempt
        yield res

        result.map(_ mustBe Left(AppError.NotFound(s"Monitor with id ${Monitors.id} does not exist")))
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

      "return error when monitor does not exist" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          res  <- repo.unpause(Monitors.id).attempt
        yield res

        result.map(_ mustBe Left(AppError.NotFound(s"Monitor with id ${Monitors.id} does not exist")))
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

      "return error when monitor does not exist" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          res  <- repo.delete(Monitors.id).attempt
        yield res

        result.map(_ mustBe Left(AppError.NotFound(s"Monitor with id ${Monitors.id} does not exist")))
      }
    }

    "update" should {
      "replace existing monitor in db" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          mon  <- repo.save(Monitors.create())
          _    <- repo.update(mon.copy(name = Monitor.Name("foo")))
          upd  <- repo.find(mon.id)
        yield upd

        result.map(_.map(_.name) mustBe Some(Monitor.Name("foo")))
      }

      "return error when monitor does not exist" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- MonitorRepository.make(db)
          res  <- repo.update(Monitors.gen()).attempt
        yield res

        result.map(_ mustBe Left(AppError.NotFound(s"Monitor with id ${Monitors.id} does not exist")))
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
