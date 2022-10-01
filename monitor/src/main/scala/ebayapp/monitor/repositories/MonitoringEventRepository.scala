package ebayapp.monitor.repositories

import cats.effect.Async
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import mongo4cats.operations.{Filter, Sort}
import mongo4cats.collection.MongoCollection
import mongo4cats.database.MongoDatabase
import mongo4cats.circe.MongoJsonCodecs
import mongo4cats.models.database.CreateCollectionOptions

trait MonitoringEventRepository[F[_]]:
  def save(event: MonitoringEvent): F[Unit]
  def findAllBy(mid: Monitor.Id, limit: Int): F[List[MonitoringEvent]]
  def findLatestBy(monitorId: Monitor.Id): F[Option[MonitoringEvent]]

final private class LiveMonitoringEventRepository[F[_]: Async](
    private val collection: MongoCollection[F, MonitoringEventEntity]
) extends MonitoringEventRepository[F]:

  private val monitorIdFilter = (id: Monitor.Id) => Filter.eq("monitorId", id.toObjectId)

  def save(event: MonitoringEvent): F[Unit] =
    collection.insertOne(MonitoringEventEntity.from(event)).void

  def findAllBy(mid: Monitor.Id, limit: Int): F[List[MonitoringEvent]] =
    collection.find(monitorIdFilter(mid)).sortByDesc("statusCheck.time").limit(limit).all.map(_.map(_.toDomain).toList)

  def findLatestBy(monitorId: Monitor.Id): F[Option[MonitoringEvent]] =
    collection.find(monitorIdFilter(monitorId)).sortByDesc("statusCheck.time").first.map(_.map(_.toDomain))

object MonitoringEventRepository extends MongoJsonCodecs:
  private val collectionName    = "monitoring-events"
  private val collectionOptions = CreateCollectionOptions(capped = true, sizeInBytes = 134217728L)

  def make[F[_]](database: MongoDatabase[F])(using F: Async[F]): F[MonitoringEventRepository[F]] =
    for
      collNames <- database.listCollectionNames
      _         <- F.unlessA(collNames.toSet.contains(collectionName))(database.createCollection(collectionName, collectionOptions))
      coll      <- database.getCollectionWithCodec[MonitoringEventEntity](collectionName)
    yield LiveMonitoringEventRepository[F](coll)
