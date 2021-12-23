package ebayapp.monitor.repositories

import mongo4cats.bson.ObjectId
import ebayapp.monitor.domain.{CreateMonitor, Monitor}

import scala.concurrent.duration.FiniteDuration

final private[repositories] case class MonitorEntity(
    _id: ObjectId,
    name: String,
    connection: Monitor.Connection,
    active: Boolean,
    interval: FiniteDuration,
    notification: Monitor.Notification
):
  def toDomain: Monitor =
    Monitor(
      Monitor.Id(_id),
      Monitor.Name(name),
      connection,
      active,
      interval,
      notification
    )

private[repositories] object MonitorEntity:
  def from(monitor: CreateMonitor): MonitorEntity =
    MonitorEntity(
      ObjectId(),
      monitor.name.value,
      monitor.connection,
      true,
      monitor.interval,
      monitor.notification
    )
