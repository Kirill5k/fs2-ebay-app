package ebayapp.monitor.repositories

import cats.effect.Async
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import ebayapp.kernel.errors.AppError
import ebayapp.kernel.syntax.effects.*
import ebayapp.monitor.common.JsonCodecs
import ebayapp.monitor.domain.{CreateMonitor, Monitor}
import mongo4cats.operations.{Filter, Update}
import mongo4cats.collection.MongoCollection
import mongo4cats.circe.MongoJsonCodecs
import mongo4cats.database.MongoDatabase
import fs2.Stream

trait MonitorRepository[F[_]]:
  def all: F[List[Monitor]]
  def stream: Stream[F, Monitor]
  def save(monitor: CreateMonitor): F[Monitor]
  def find(id: Monitor.Id): F[Option[Monitor]]
  def activate(id: Monitor.Id, active: Boolean): F[Unit]
  def pause(id: Monitor.Id): F[Unit]   = activate(id, false)
  def unpause(id: Monitor.Id): F[Unit] = activate(id, true)
  def delete(id: Monitor.Id): F[Unit]
  def update(monitor: Monitor): F[Unit]

final private class LiveMonitorRepository[F[_]](
    private val collection: MongoCollection[F, MonitorEntity]
)(using
    F: Async[F]
) extends MonitorRepository[F]:

  def save(monitor: CreateMonitor): F[Monitor] =
    val entity = MonitorEntity.from(monitor)
    collection.insertOne(entity).as(entity.toDomain)

  def all: F[List[Monitor]]      = collection.find.all.mapList(_.toDomain)
  def stream: Stream[F, Monitor] = collection.find.stream.map(_.toDomain)

  def find(id: Monitor.Id): F[Option[Monitor]] =
    collection
      .find(Filter.idEq(id.toObjectId))
      .first
      .mapOpt(_.toDomain)

  def delete(id: Monitor.Id): F[Unit] =
    collection
      .deleteOne(Filter.idEq(id.toObjectId))
      .map(_.getDeletedCount)
      .flatMap(notFoundErrorIfNoMatches(id))

  def activate(id: Monitor.Id, active: Boolean): F[Unit] =
    collection
      .updateOne(Filter.idEq(id.toObjectId), Update.set("active", active))
      .map(_.getMatchedCount)
      .flatMap(notFoundErrorIfNoMatches(id))

  def update(monitor: Monitor): F[Unit] =
    collection
      .replaceOne(Filter.idEq(monitor.id.toObjectId), MonitorEntity.from(monitor))
      .map(_.getMatchedCount)
      .flatMap(notFoundErrorIfNoMatches(monitor.id))

  private def notFoundErrorIfNoMatches(id: Monitor.Id)(matchCount: Long): F[Unit] =
    F.raiseWhen(matchCount == 0)(AppError.NotFound(s"Monitor with id $id does not exist"))

object MonitorRepository extends MongoJsonCodecs:
  private val collectionName = "monitors"
  def make[F[_]: Async](database: MongoDatabase[F]): F[MonitorRepository[F]] =
    database.getCollectionWithCodec[MonitorEntity](collectionName).map(LiveMonitorRepository[F](_))
