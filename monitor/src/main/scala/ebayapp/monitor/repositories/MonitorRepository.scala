package ebayapp.monitor.repositories

import cats.effect.Async
import cats.syntax.applicative.*
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
import ebayapp.monitor.common.JsonCodecs
import ebayapp.monitor.common.errors.AppError
import ebayapp.monitor.common.json.given
import ebayapp.monitor.domain.Monitor
import io.circe.generic.auto.*
import mongo4cats.collection.operations.{Filter, Update}
import mongo4cats.collection.MongoCollection
import mongo4cats.circe.*
import mongo4cats.database.MongoDatabase

trait MonitorRepository[F[_]]:
  def save(monitor: Monitor): F[Unit]
  def find(id: Monitor.Id): F[Monitor]
  def pause(id: Monitor.Id): F[Unit]
  def unpause(id: Monitor.Id): F[Unit]
  def delete(id: Monitor.Id): F[Unit]
  def getAllActive: F[List[Monitor]]

final private class LiveMonitorRepository[F[_]](
    val collection: MongoCollection[F, MonitorEntity]
)(using
    F: Async[F]
) extends MonitorRepository[F] {

  def getAllActive: F[List[Monitor]] =
    collection.find(Filter.eq("active", true)).all.map(_.map(_.toDomain).toList)

  def save(monitor: Monitor): F[Unit] =
    collection.insertOne(MonitorEntity.from(monitor)).void

  def find(id: Monitor.Id): F[Monitor] =
    collection
      .find(Filter.idEq(id.toObjectId))
      .first
      .flatMap {
        case Some(entity) => entity.toDomain.pure[F]
        case None         => AppError.MonitorNotFound(id).raiseError[F, Monitor]
      }

  def delete(id: Monitor.Id): F[Unit] =
    collection
      .deleteOne(Filter.idEq(id.toObjectId))
      .flatMap { result =>
        if (result.getDeletedCount > 0) ().pure[F]
        else AppError.MonitorNotFound(id).raiseError[F, Unit]
      }

  def pause(id: Monitor.Id): F[Unit] = setActive(id, false)

  def unpause(id: Monitor.Id): F[Unit] = setActive(id, true)

  private def setActive(id: Monitor.Id, active: Boolean): F[Unit] =
    collection
      .updateOne(Filter.idEq(id.toObjectId), Update.set("active", false))
      .flatMap { result =>
        if (result.getMatchedCount > 0) ().pure[F]
        else AppError.MonitorNotFound(id).raiseError[F, Unit]
      }
}

object MonitorRepository:
  private val collectionName = "monitors"
  def mongo[F[_]: Async](database: MongoDatabase[F]): F[MonitorRepository[F]] =
    database
      .getCollectionWithCodec[MonitorEntity](collectionName)
      .map(coll => LiveMonitorRepository[F](coll))
