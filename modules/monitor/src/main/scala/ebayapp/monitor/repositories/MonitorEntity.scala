package ebayapp.monitor.repositories

import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec
import mongo4cats.bson.ObjectId
import mongo4cats.circe.MongoJsonCodecs
import ebayapp.kernel.JsonCodecs
import ebayapp.monitor.domain.{CreateMonitor, Monitor}
import mongo4cats.codecs.MongoCodecProvider

import scala.concurrent.duration.FiniteDuration

final private[repositories] case class MonitorEntity(
    _id: ObjectId,
    name: String,
    connection: Monitor.Connection,
    active: Boolean,
    interval: Option[FiniteDuration],
    schedule: Option[Monitor.Schedule],
    contact: Monitor.Contact
):
  def toDomain: Monitor =
    Monitor(
      Monitor.Id(_id),
      Monitor.Name(name),
      connection,
      active,
      schedule.getOrElse(Monitor.Schedule.Periodic(interval.get)),
      contact
    )

private[repositories] object MonitorEntity extends JsonCodecs with MongoJsonCodecs {
  given Codec[MonitorEntity]                = deriveCodec[MonitorEntity]
  given MongoCodecProvider[MonitorEntity]   = deriveCirceCodecProvider[MonitorEntity]
  def from(monitor: Monitor): MonitorEntity =
    MonitorEntity(
      monitor.id.toObjectId,
      monitor.name.value,
      monitor.connection,
      monitor.active,
      None,
      Some(monitor.schedule),
      monitor.contact
    )

  def from(monitor: CreateMonitor): MonitorEntity =
    MonitorEntity(
      ObjectId(),
      monitor.name.value,
      monitor.connection,
      true,
      None,
      Some(monitor.schedule),
      monitor.contact
    )
}
