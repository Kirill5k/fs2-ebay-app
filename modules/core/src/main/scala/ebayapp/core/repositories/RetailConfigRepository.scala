package ebayapp.core.repositories

import cats.effect.kernel.Async
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import ebayapp.core.common.config.RetailConfig
import io.circe.syntax.*
import mongo4cats.circe.given
import mongo4cats.collection.MongoCollection
import mongo4cats.database.MongoDatabase
import mongo4cats.models.database.CreateCollectionOptions
import fs2.Stream

trait RetailConfigRepository[F[_]]:
  def save(rc: RetailConfig): F[Unit]
  def get: F[Option[RetailConfig]]
  def updates: Stream[F, RetailConfig]

final private class LiveRetailConfigRepository[F[_]](
    private val collection: MongoCollection[F, RetailConfig]
)(using
    F: Async[F]
) extends RetailConfigRepository[F] {
  override def get: F[Option[RetailConfig]] =
    collection.find.first

  override def save(rc: RetailConfig): F[Unit] =
    collection.insertOne(rc).void

  override def updates: Stream[F, RetailConfig] =
    collection.watch.stream.evalMap { cs =>
      F.fromEither(cs.getFullDocument.asJson.as[RetailConfig])
    }
}

object RetailConfigRepository {
  private val collectionName    = "retail-config"
  private val collectionOptions = CreateCollectionOptions(capped = true, maxDocuments = 1, sizeInBytes = 268435456L)

  def mongo[F[_]](database: MongoDatabase[F])(using F: Async[F]): F[RetailConfigRepository[F]] =
    for
      collNames <- database.listCollectionNames
      _         <- F.unlessA(collNames.toSet.contains(collectionName))(database.createCollection(collectionName, collectionOptions))
      coll      <- database.getCollectionWithCodec[RetailConfig](collectionName)
    yield LiveRetailConfigRepository[F](coll)
}
