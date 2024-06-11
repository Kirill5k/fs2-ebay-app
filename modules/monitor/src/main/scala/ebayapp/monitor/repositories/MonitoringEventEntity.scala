package ebayapp.monitor.repositories

import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import ebayapp.kernel.json.given
import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec
import mongo4cats.bson.ObjectId
import mongo4cats.circe.given

import java.time.Instant

final private[repositories] case class MonitoringEventEntity(
    monitorId: ObjectId,
    statusCheck: MonitoringEvent.StatusCheck,
    downTime: Option[Instant]
) derives Codec.AsObject:
  def toDomain: MonitoringEvent = MonitoringEvent(Monitor.Id(monitorId), statusCheck, downTime)

private[repositories] object MonitoringEventEntity:
  given Codec[MonitoringEvent.StatusCheck] = deriveCodec[MonitoringEvent.StatusCheck]
  def from(me: MonitoringEvent): MonitoringEventEntity =
    MonitoringEventEntity(
      me.monitorId.toObjectId,
      me.statusCheck,
      me.downTime
    )
