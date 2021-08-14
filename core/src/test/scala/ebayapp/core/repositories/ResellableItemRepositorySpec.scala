package ebayapp.core.repositories

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.core.MockLogger
import ebayapp.core.common.Logger
import ebayapp.core.common.config.SearchQuery
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import mongo4cats.embedded.EmbeddedMongo
import org.bson.Document
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec

import java.time.Instant
import java.time.temporal.ChronoField.MILLI_OF_SECOND
import scala.concurrent.Future

class ResellableItemRepositorySpec extends AsyncWordSpec with Matchers with EmbeddedMongo {

  implicit val logger: Logger[IO] = MockLogger.make[IO]

  val videoGames: List[ResellableItem.VideoGame] = List(
    ResellableItemBuilder.videoGame("GTA 5", Instant.now().minusSeconds(1000).`with`(MILLI_OF_SECOND, 0)),
    ResellableItemBuilder.videoGame("Call of Duty WW2", Instant.now().`with`(MILLI_OF_SECOND, 0)),
    ResellableItemBuilder.videoGame("Super Mario 3", Instant.now().plusSeconds(1000).`with`(MILLI_OF_SECOND, 0))
  )

  "VideoGameRepository" should {

    "existsByUrl" should {
      "return true if video game already exists by url" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo   <- ResellableItemRepository.videoGamesMongo[IO](db)
            _      <- repo.saveAll(videoGames)
            exists <- repo.existsByUrl("https://www.ebay.co.uk/itm/super-mario-3")
          } yield exists

          result.map(_ mustBe true)
        }
      }

      "return false if does not exist" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo   <- ResellableItemRepository.videoGamesMongo[IO](db)
            exists <- repo.existsByUrl("https://www.ebay.co.uk/itm/super-mario-3")
          } yield exists

          result.map(_ mustBe false)
        }
      }
    }

    "search" should {

      "find video games through search" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            coll <- db.getCollection("videoGames")
            _    <- coll.createIndex(Document.parse("""{"itemDetails.name":"text","itemDetails.platform":"text"}"""))
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            res  <- repo.search(SearchQuery("mario"))
          } yield res

          result.map(_ mustBe List(videoGames.last))
        }
      }
    }

    "findAll" should {

      "return all video games" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            all  <- repo.findAll()
          } yield all

          result.map(_ mustBe videoGames.reverse)
        }
      }

      "return all video games posted after provided date" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            all  <- repo.findAll(from = Some(Instant.now))
          } yield all

          result.map(_ mustBe (List(videoGames(2))))
        }
      }

      "return all video games posted between provided dates" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            from = Some(Instant.now().minusSeconds(100))
            to   = Some(Instant.now.plusSeconds(100))
            all <- repo.findAll(from = from, to = to)
          } yield all

          result.map(_ mustBe (List(videoGames(1))))
        }
      }

      "return all video games posted before provided date" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            all  <- repo.findAll(to = Some(Instant.now.minusSeconds(100)))
          } yield all

          result.map(_ mustBe (List(videoGames(0))))
        }
      }

      "return all video games with limit" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            all  <- repo.findAll(limit = Some(1))
          } yield all

          result.map(_ mustBe (List(videoGames(2))))
        }
      }
    }

    "stream" should {

      "return all video games" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            all  <- repo.stream().compile.toList
          } yield all

          result.map(_ mustBe (videoGames.reverse))
        }
      }

      "return all video games posted after provided date" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            all  <- repo.stream(from = Some(Instant.now)).compile.toList
          } yield all

          result.map(_ mustBe (List(videoGames(2))))
        }
      }

      "return all video games posted between provided dates" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            from = Some(Instant.now().minusSeconds(100))
            to   = Some(Instant.now.plusSeconds(100))
            all <- repo.stream(from = from, to = to).compile.toList
          } yield all

          result.map(_ mustBe (List(videoGames(1))))
        }
      }

      "return all video games posted before provided date" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            all  <- repo.stream(to = Some(Instant.now.minusSeconds(100))).compile.toList
          } yield all

          result.map(_ mustBe (List(videoGames(0))))
        }
      }

      "return all video games with limit" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            _    <- repo.saveAll(videoGames)
            all  <- repo.stream(limit = Some(1)).compile.toList
          } yield all

          result.map(_ mustBe (List(videoGames(2))))
        }
      }
    }

    "save" should {
      "save video game in db" in {
        withEmbeddedMongoClient { db =>
          val result = for {
            repo <- ResellableItemRepository.videoGamesMongo[IO](db)
            res  <- repo.save(ResellableItemBuilder.videoGame("Witcher 3"))
          } yield res

          result.map(_ mustBe (()))
        }
      }
    }
  }

  def withEmbeddedMongoClient[A](test: MongoDatabase[IO] => IO[A]): Future[A] =
    withRunningEmbeddedMongo("localhost", 12345) {
      MongoClient
        .fromConnectionString[IO]("mongodb://localhost:12345")
        .evalMap(_.getDatabase("ebay-app"))
        .use(test)
    }.unsafeToFuture()
}
