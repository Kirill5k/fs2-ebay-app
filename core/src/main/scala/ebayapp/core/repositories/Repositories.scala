package ebayapp.core.repositories

import cats.effect.kernel.Async
import cats.implicits._
import ebayapp.core.repositories.ResellableItemRepository._
import mongo4cats.database.MongoDatabase

trait Repositories[F[_]] {
  def videoGames: VideoGameRepository[F]
}

object Repositories {

  def make[F[_]: Async](database: MongoDatabase[F]): F[Repositories[F]] =
    ResellableItemRepository.videoGamesMongo(database).map { vgr =>
      new Repositories[F] {
        override def videoGames: VideoGameRepository[F] = vgr
      }
    }
}
