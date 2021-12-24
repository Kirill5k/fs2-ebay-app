package ebayapp.monitor.repositories

import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import mongo4cats.bson.ObjectId

import java.time.Instant
import scala.concurrent.duration.FiniteDuration

final private[repositories] case class MonitoringEventEntity(
    _id: ObjectId,
    monitorId: ObjectId,
    statusCheck: MonitoringEvent.StatusCheck,
    downTime: Option[FiniteDuration]
):
  def toDomain: MonitoringEvent =
    MonitoringEvent(Monitor.Id(monitorId), statusCheck, downTime)

private[repositories] object MonitoringEventEntity:
  def from(me: MonitoringEvent): MonitoringEventEntity =
    MonitoringEventEntity(
      ObjectId(),
      me.monitorId.toObjectId,
      me.statusCheck,
      me.downTime
    )
