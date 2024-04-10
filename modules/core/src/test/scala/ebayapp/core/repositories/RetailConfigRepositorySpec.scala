package ebayapp.core.repositories

import cats.effect.IO
import cats.effect.unsafe.IORuntime
import ebayapp.core.common.config.RetailConfig
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import mongo4cats.embedded.EmbeddedMongo
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AsyncWordSpec

import scala.concurrent.Future

class RetailConfigRepositorySpec extends AsyncWordSpec with Matchers with EmbeddedMongo {

  override val mongoPort: Int = 12347

  "A RetailConfigRepositorySpec" when {
    "save" should {
      "store config in a database" in withEmbeddedMongoClient { db =>
        for {
          conf <- RetailConfig.loadDefault[IO]
          repo <- RetailConfigRepository.mongo(db)
          _    <- repo.save(conf)
          res  <- repo.get
        } yield res mustBe Some(conf)
      }
    }
  }

  def withEmbeddedMongoClient[A](test: MongoDatabase[IO] => IO[A]): Future[A] =
    withRunningEmbeddedMongo(mongoPort) {
      MongoClient
        .fromConnectionString[IO](s"mongodb://localhost:$mongoPort")
        .evalMap(_.getDatabase("ebay-app"))
        .use(test)
    }.unsafeToFuture()(IORuntime.global)
}
