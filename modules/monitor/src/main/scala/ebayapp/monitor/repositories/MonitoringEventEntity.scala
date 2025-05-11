package ebayapp.monitor.repositories

import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec
import ebayapp.kernel.JsonCodecs
import mongo4cats.bson.ObjectId
import mongo4cats.circe.MongoJsonCodecs
import mongo4cats.codecs.MongoCodecProvider

import java.time.Instant

final private[repositories] case class MonitoringEventEntity(
    monitorId: ObjectId,
    statusCheck: MonitoringEvent.StatusCheck,
    downTime: Option[Instant]
):
  def toDomain: MonitoringEvent = MonitoringEvent(Monitor.Id(monitorId), statusCheck, downTime)

private[repositories] object MonitoringEventEntity extends JsonCodecs with MongoJsonCodecs {
  given Codec[MonitoringEvent.StatusCheck]        = deriveCodec[MonitoringEvent.StatusCheck]
  given Codec[MonitoringEventEntity]              = deriveCodec[MonitoringEventEntity]
  given MongoCodecProvider[MonitoringEventEntity] = deriveCirceCodecProvider[MonitoringEventEntity]

  def from(me: MonitoringEvent): MonitoringEventEntity =
    MonitoringEventEntity(
      me.monitorId.toObjectId,
      me.statusCheck,
      me.downTime
    )
}
