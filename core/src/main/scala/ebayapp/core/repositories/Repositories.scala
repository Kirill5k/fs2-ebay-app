package ebayapp.core.repositories

import cats.effect.kernel.Async
import cats.syntax.functor.*
import mongo4cats.database.MongoDatabase

trait Repositories[F[_]] {
  def resellableItems: ResellableItemRepository[F]
}

object Repositories {

  def make[F[_]: Async](database: MongoDatabase[F]): F[Repositories[F]] =
    ResellableItemRepository.mongo(database).map { itemsRepo =>
      new Repositories[F] {
        override def resellableItems: ResellableItemRepository[F] = itemsRepo
      }
    }
}
