package ebayapp.monitor.repositories

import cats.effect.Async
import cats.syntax.applicative.*
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import cats.syntax.applicativeError.*
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
  def pause(id: Monitor.Id): F[Unit]
  def unpause(id: Monitor.Id): F[Unit]
  def delete(id: Monitor.Id): F[Unit]
  def getAllActive: F[List[Monitor]]

final private class LiveMonitorRepository[F[_]: Async](
    val collection: MongoCollection[F, MonitorEntity]
) extends MonitorRepository[F]:

  def save(monitor: CreateMonitor): F[Monitor] =
    val entity = MonitorEntity.from(monitor)
    collection.insertOne(entity).as(entity.toDomain)

  def getAllActive: F[List[Monitor]] =
    collection.find(Filter.eq("active", true)).all.map(_.map(_.toDomain).toList)

  def find(id: Monitor.Id): F[Option[Monitor]] =
    collection.find(Filter.idEq(id.toObjectId)).first.map(_.map(_.toDomain))

  def delete(id: Monitor.Id): F[Unit] =
    collection.deleteOne(Filter.idEq(id.toObjectId)).void

  def pause(id: Monitor.Id): F[Unit] = setActive(id, false)

  def unpause(id: Monitor.Id): F[Unit] = setActive(id, true)

  private def setActive(id: Monitor.Id, active: Boolean): F[Unit] =
    collection.updateOne(Filter.idEq(id.toObjectId), Update.set("active", active)).void

object MonitorRepository:
  private val collectionName = "monitors"
  def make[F[_]: Async](database: MongoDatabase[F]): F[MonitorRepository[F]] =
    database
      .getCollectionWithCodec[MonitorEntity](collectionName)
      .map(coll => LiveMonitorRepository[F](coll))
