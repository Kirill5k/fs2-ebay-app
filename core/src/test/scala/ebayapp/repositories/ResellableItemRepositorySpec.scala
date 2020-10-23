package ebayapp.repositories

import java.time.Instant
import java.time.temporal.ChronoField.MILLI_OF_SECOND

import cats.effect.{ContextShift, IO}
import ebayapp.domain.{ResellableItem, ResellableItemBuilder}
import io.chrisdavenport.log4cats.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import mongo4cats.client.MongoClientF
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

import scala.concurrent.ExecutionContext

class ResellableItemRepositorySpec extends AnyWordSpec with Matchers with EmbeddedMongo {

  implicit val cs: ContextShift[IO] = IO.contextShift(ExecutionContext.global)
  implicit val logger: Logger[IO]   = Slf4jLogger.getLogger[IO]

  val videoGames: List[ResellableItem.VideoGame] = List(
    ResellableItemBuilder.videoGame("GTA 5", Instant.now().minusSeconds(1000).`with`(MILLI_OF_SECOND, 0)),
    ResellableItemBuilder.videoGame("Call of Duty WW2", Instant.now().`with`(MILLI_OF_SECOND, 0)),
    ResellableItemBuilder.videoGame("Super Mario 3", Instant.now().plusSeconds(1000).`with`(MILLI_OF_SECOND, 0))
  )

  "VideoGameRepository" should {

    "existsByUrl" should {
      "return true if video game already exists by url" in {
        withEmbeddedMongoClient { client =>
          val result = for {
            repo   <- ResellableItemRepository.videoGamesMongo[IO](client)
            _      <- repo.saveAll(videoGames)
            exists <- repo.existsByUrl("https://www.ebay.co.uk/itm/super-mario-3")
          } yield exists

          result.unsafeRunSync() must be(true)
        }
      }

      "return false if does not exist" in {
        withEmbeddedMongoClient { client =>
          val result = for {
            repo   <- ResellableItemRepository.videoGamesMongo[IO](client)
            exists <- repo.existsByUrl("https://www.ebay.co.uk/itm/super-mario-3")
          } yield exists

          result.unsafeRunSync() must be(false)
        }
      }
    }

    "findAll" should {

      "return all video games" in {
        withEmbeddedMongoClient { client =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](client)
            _    <- repo.saveAll(videoGames)
            all  <- repo.findAll().compile.toList
          } yield all

          result.unsafeRunSync() must be(videoGames.reverse)
        }
      }

      "return all video games posted after provided date" in {
        withEmbeddedMongoClient { client =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](client)
            _    <- repo.saveAll(videoGames)
            all  <- repo.findAll(from = Some(Instant.now)).compile.toList
          } yield all

          result.unsafeRunSync() must be(List(videoGames(2)))
        }
      }

      "return all video games posted between provided dates" in {
        withEmbeddedMongoClient { client =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](client)
            _    <- repo.saveAll(videoGames)
            from = Some(Instant.now().minusSeconds(100))
            to   = Some(Instant.now.plusSeconds(100))
            all <- repo.findAll(from = from, to = to).compile.toList
          } yield all

          result.unsafeRunSync() must be(List(videoGames(1)))
        }
      }

      "return all video games posted before provided date" in {
        withEmbeddedMongoClient { client =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](client)
            _    <- repo.saveAll(videoGames)
            all  <- repo.findAll(to = Some(Instant.now.minusSeconds(100))).compile.toList
          } yield all

          result.unsafeRunSync() must be(List(videoGames(0)))
        }
      }

      "return all video games with limit" in {
        withEmbeddedMongoClient { client =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](client)
            _    <- repo.saveAll(videoGames)
            all  <- repo.findAll(limit = Some(1)).compile.toList
          } yield all

          result.unsafeRunSync() must be(List(videoGames(2)))
        }
      }
    }

    "save" should {
      "save video game in db" in {
        withEmbeddedMongoClient { client =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](client)
            res  <- repo.save(ResellableItemBuilder.videoGame("Witcher 3"))
          } yield res

          result.unsafeRunSync() must be(())
        }
      }
    }
  }

  def withEmbeddedMongoClient[A](test: MongoClientF[IO] => A): A =
    withRunningEmbeddedMongo() {
      MongoClientF
        .fromConnectionString[IO]("mongodb://localhost:12345")
        .use { client =>
          IO(test(client))
        }
        .unsafeRunSync()
    }
}
