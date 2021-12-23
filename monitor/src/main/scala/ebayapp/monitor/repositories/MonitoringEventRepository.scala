package ebayapp.monitor.repositories

import cats.effect.Async
import cats.syntax.applicative.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import io.circe.generic.auto.*
import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import ebayapp.monitor.common.json.given
import mongo4cats.collection.operations.Filter
import mongo4cats.collection.MongoCollection
import mongo4cats.database.{CreateCollectionOptions, MongoDatabase}
import mongo4cats.circe.*

trait MonitoringEventRepository[F[_]]:
  def save(event: MonitoringEvent): F[Unit]
  def findAllBy(monitorId: Monitor.Id): F[List[MonitoringEvent]]

final private class LiveMonitoringEventRepository[F[_]: Async](
    val collection: MongoCollection[F, MonitoringEventEntity]
) extends MonitoringEventRepository[F]:

  def save(event: MonitoringEvent): F[Unit] =
    collection.insertOne(MonitoringEventEntity.from(event)).void

  def findAllBy(monitorId: Monitor.Id): F[List[MonitoringEvent]] =
    collection.find(Filter.eq("monitorId", monitorId.toObjectId)).all.map(_.map(_.toDomain).toList)

object MonitoringEventRepository:
  private val collectionName    = "monitoring-events"
  private val collectionOptions = CreateCollectionOptions().capped(true).sizeInBytes(134217728L)

  def make[F[_]: Async](database: MongoDatabase[F]): F[MonitoringEventRepository[F]] =
    for
      collNames <- database.listCollectionNames
      _    <- if (collNames.toSet.contains(collectionName)) ().pure[F] else database.createCollection(collectionName, collectionOptions)
      coll <- database.getCollectionWithCodec[MonitoringEventEntity](collectionName)
    yield LiveMonitoringEventRepository[F](coll)
