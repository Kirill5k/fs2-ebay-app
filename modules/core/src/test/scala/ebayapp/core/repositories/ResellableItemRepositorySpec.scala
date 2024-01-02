package ebayapp.core.repositories

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import cats.syntax.traverse.*
import ebayapp.core.domain.{ItemKind, ResellableItem, SearchParams}
import ebayapp.core.domain.ResellableItemBuilder.*
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import mongo4cats.embedded.EmbeddedMongo
import org.bson.Document
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec

import java.time.Instant
import java.time.temporal.ChronoUnit
import scala.concurrent.Future

class ResellableItemRepositorySpec extends AsyncWordSpec with Matchers with EmbeddedMongo {

  override val mongoPort: Int = 12346

  val timestamp = Instant.now.truncatedTo(ChronoUnit.SECONDS)

  val videoGames = List(
    makeVideoGame("GTA 5", timestamp.minusSeconds(1000)),
    makeVideoGame("Call of Duty WW2", timestamp, sellPrice = None),
    makeVideoGame("Super Mario 3", timestamp.plusSeconds(1000), platform = None)
  )

  val searchFilters = SearchParams(Some(ItemKind.VideoGame), Some(100), None, None)

  "A ResellableItemRepository" when {

    "existsByUrl" should {
      "return true if video game already exists by url" in withEmbeddedMongoClient { db =>
        val result = for
          repo   <- ResellableItemRepository.mongo[IO](db)
          _      <- repo.saveAll(videoGames)
          exists <- repo.existsByUrl("https://www.ebay.co.uk/itm/super-mario-3")
        yield exists

        result.map(_ mustBe true)
      }

      "return false if does not exist" in withEmbeddedMongoClient { db =>
        val result = for
          repo   <- ResellableItemRepository.mongo[IO](db)
          exists <- repo.existsByUrl("https://www.ebay.co.uk/itm/super-mario-3")
        yield exists

        result.map(_ mustBe false)
      }
    }

    "search" should {

      "find video games through search" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- ResellableItemRepository.mongo[IO](db)
          coll <- db.getCollection("items")
          _    <- coll.createIndex(Document.parse("""{"itemDetails.name":"text","itemDetails.platform":"text"}"""))
          _    <- repo.saveAll(videoGames)
          res  <- repo.search(searchFilters.copy(query = Some("mario")))
        yield res

        result.map(_ mustBe List(videoGames.last))
      }

      "not return anything when kind is different" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- ResellableItemRepository.mongo[IO](db)
          _    <- repo.saveAll(videoGames)
          all  <- repo.search(searchFilters.copy(kind = Some(ItemKind.Generic)))
        yield all

        result.map(_ mustBe Nil)
      }

      "return all video games" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- ResellableItemRepository.mongo[IO](db)
          _    <- repo.saveAll(videoGames)
          all  <- repo.search(searchFilters)
        yield all

        result.map(_ mustBe videoGames.reverse)
      }

      "return all video games posted after provided date" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- ResellableItemRepository.mongo[IO](db)
          _    <- repo.saveAll(videoGames)
          all  <- repo.search(searchFilters.copy(from = Some(Instant.now)))
        yield all

        result.map(_ mustBe List(videoGames.last))
      }

      "return all video games posted between provided dates" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- ResellableItemRepository.mongo[IO](db)
          _    <- repo.saveAll(videoGames)
          from = Some(Instant.now().minusSeconds(500))
          to   = Some(Instant.now.plusSeconds(500))
          all <- repo.search(searchFilters.copy(from = from, to = to))
        yield all

        result.map(_ mustBe List(videoGames(1)))
      }

      "return all video games posted before provided date" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- ResellableItemRepository.mongo[IO](db)
          _    <- repo.saveAll(videoGames)
          all  <- repo.search(searchFilters.copy(to = Some(Instant.now.minusSeconds(500))))
        yield all

        result.map(_ mustBe List(videoGames.head))
      }

      "return all video games with limit" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- ResellableItemRepository.mongo[IO](db)
          _    <- repo.saveAll(videoGames)
          all  <- repo.search(searchFilters.copy(limit = Some(1)))
        yield all

        result.map(_ mustBe List(videoGames(2)))
      }
    }

    "save" should {
      "save video game in db" in withEmbeddedMongoClient { db =>
        val result = for
          repo <- ResellableItemRepository.mongo[IO](db)
          res  <- repo.save(makeVideoGame("Witcher 3"))
        yield res

        result.map(_ mustBe (()))
      }
    }
  }

  "summaries" should {
    "return summaries of stored items" in {
      withEmbeddedMongoClient { db =>
        val result = for
          repo <- ResellableItemRepository.mongo[IO](db)
          _    <- repo.saveAll(videoGames)
          all  <- repo.summaries(searchFilters)
        yield all

        result.map { res =>
          res mustBe videoGames.sortBy(_.listingDetails.datePosted)(Ordering[Instant].reverse).map(_.summary)
        }
      }
    }
  }

  extension (repo: ResellableItemRepository[IO])
    def saveAll(items: List[ResellableItem]): IO[Unit] =
      items.traverse(repo.save).void

  def withEmbeddedMongoClient[A](test: MongoDatabase[IO] => IO[A]): Future[A] =
    withRunningEmbeddedMongo(mongoPort) {
      MongoClient
        .fromConnectionString[IO](s"mongodb://localhost:$mongoPort")
        .evalMap(_.getDatabase("ebay-app"))
        .use(test)
    }.unsafeToFuture()(IORuntime.global)
}
