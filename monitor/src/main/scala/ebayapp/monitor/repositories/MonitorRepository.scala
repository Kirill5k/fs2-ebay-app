package ebayapp.monitor.repositories

import cats.effect.Async
import com.mongodb.reactivestreams.client.MongoCollection
import ebayapp.monitor.domain.Monitor

trait MonitorRepository[F[_]]:
  def save(monitor: Monitor): F[Unit]
  def find(id: Monitor.Id): F[Monitor]
  def pause(id: Monitor.Id): F[Monitor]
  def unpause(id: Monitor.Id): F[Monitor]
  def delete(id: Monitor.Id): F[Unit]
  def getAll: F[List[Monitor]]

final private class LiveMonitorRepository[F[_]](
    val collection: MongoCollection[MonitorEntity]
)(using
    F: Async[F]
) extends MonitorRepository[F] {

  def save(monitor: Monitor): F[Unit]     = ???
  def find(id: Monitor.Id): F[Monitor]    = ???
  def pause(id: Monitor.Id): F[Monitor]   = ???
  def unpause(id: Monitor.Id): F[Monitor] = ???
  def delete(id: Monitor.Id): F[Unit]     = ???
  def getAll: F[List[Monitor]]            = ???
}

object MonitorRepository {}
