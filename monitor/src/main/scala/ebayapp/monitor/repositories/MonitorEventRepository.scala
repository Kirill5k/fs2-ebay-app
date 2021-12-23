package ebayapp.monitor.repositories

import cats.effect.Async
import ebayapp.monitor.domain.{Monitor, MonitorEvent}
import mongo4cats.collection.MongoCollection

trait MonitorEventRepository[F[_]]:
  def save(event: MonitorEvent): F[Unit]
  def findBy(id: Monitor.Id): F[List[MonitorEvent]]

final private class LiveMonitorEventRepository[F[_]: Async](
    val collection: MongoCollection[F, MonitorEventEntity]
) extends MonitorEventRepository[F]:

  def save(event: MonitorEvent): F[Unit] = ???
  def findBy(id: Monitor.Id): F[List[MonitorEvent]] = ???

object MonitorEventRepository {}
