package ebayapp.monitor.repositories

import cats.effect.Async
import cats.syntax.applicative.*
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import ebayapp.kernel.errors.AppError
import ebayapp.monitor.common.JsonCodecs
import ebayapp.monitor.common.json.given
import ebayapp.monitor.domain.{CreateMonitor, Monitor}
import io.circe.generic.auto.*
import mongo4cats.collection.operations.{Filter, Update}
import mongo4cats.collection.MongoCollection
import mongo4cats.circe.*
import mongo4cats.database.MongoDatabase

trait MonitorRepository[F[_]]:
  def save(monitor: CreateMonitor): F[Monitor]
  def find(id: Monitor.Id): F[Option[Monitor]]
  def activate(id: Monitor.Id, active: Boolean): F[Unit]
  def pause(id: Monitor.Id): F[Unit]   = activate(id, false)
  def unpause(id: Monitor.Id): F[Unit] = activate(id, true)
  def delete(id: Monitor.Id): F[Unit]
  def getAll: F[List[Monitor]]
  def getAllActive: F[List[Monitor]]

final private class LiveMonitorRepository[F[_]: Async](
    private val collection: MongoCollection[F, MonitorEntity]
) extends MonitorRepository[F]:

  def save(monitor: CreateMonitor): F[Monitor] =
    val entity = MonitorEntity.from(monitor)
    collection.insertOne(entity).as(entity.toDomain)

  def getAll: F[List[Monitor]]       = findAll(Filter.empty)
  def getAllActive: F[List[Monitor]] = findAll(Filter.eq("active", true))
  private def findAll(filter: Filter): F[List[Monitor]] =
    collection.find(filter).all.map(_.map(_.toDomain).toList)

  def find(id: Monitor.Id): F[Option[Monitor]] =
    collection.find(Filter.idEq(id.toObjectId)).first.map(_.map(_.toDomain))

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

  private def notFoundErrorIfNoMatches(id: Monitor.Id)(matchCount: Long): F[Unit] =
    if (matchCount == 0) AppError.NotFound(s"Monitor with id $id does not exist").raiseError[F, Unit] else ().pure[F]

object MonitorRepository:
  private val collectionName = "monitors"
  def make[F[_]: Async](database: MongoDatabase[F]): F[MonitorRepository[F]] =
    database
      .getCollectionWithCodec[MonitorEntity](collectionName)
      .map(coll => LiveMonitorRepository[F](coll))
