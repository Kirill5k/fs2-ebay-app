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
    contact: Monitor.Contact
):
  def toDomain: Monitor =
    Monitor(
      Monitor.Id(_id),
      Monitor.Name(name),
      connection,
      active,
      interval,
      contact
    )

private[repositories] object MonitorEntity:
  def from(monitor: Monitor): MonitorEntity =
    MonitorEntity(
      monitor.id.toObjectId,
      monitor.name.value,
      monitor.connection,
      monitor.active,
      monitor.interval,
      monitor.contact
    )
  
  def from(monitor: CreateMonitor): MonitorEntity =
    MonitorEntity(
      ObjectId(),
      monitor.name.value,
      monitor.connection,
      true,
      monitor.interval,
      monitor.contact
    )
