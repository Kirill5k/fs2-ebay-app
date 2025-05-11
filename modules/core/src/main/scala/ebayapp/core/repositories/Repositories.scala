package ebayapp.core.repositories

import cats.effect.kernel.Async
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import mongo4cats.database.MongoDatabase

trait Repositories[F[_]]:
  def resellableItems: ResellableItemRepository[F]
  def retailConfig: RetailConfigRepository[F]

object Repositories:
  def make[F[_]: Async](database: MongoDatabase[F]): F[Repositories[F]] =
    for
      items <- ResellableItemRepository.mongo(database)
      rc    <- RetailConfigRepository.mongo(database)
    yield new Repositories[F]:
      override def resellableItems: ResellableItemRepository[F] = items
      override def retailConfig: RetailConfigRepository[F]      = rc
