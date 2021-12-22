package ebayapp.monitor.repositories

import mongo4cats.bson.ObjectId
import ebayapp.monitor.domain.Monitor

import scala.concurrent.duration.FiniteDuration

final case class MonitorEntity(
    id: ObjectId,
    name: String,
    connection: Monitor.Connection,
    active: Boolean,
    interval: FiniteDuration,
    notification: Monitor.Notification
):
  def toDomain: Monitor =
    Monitor(
      Monitor.Id(id),
      Monitor.Name(name),
      connection,
      active,
      interval,
      notification
    )

object MonitorEntity:
  def from(monitor: Monitor): MonitorEntity =
    MonitorEntity(
      monitor.id.toObjectId,
      monitor.name.value,
      monitor.connection,
      monitor.active,
      monitor.interval,
      monitor.notification
    )