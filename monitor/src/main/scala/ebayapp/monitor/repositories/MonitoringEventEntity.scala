package ebayapp.monitor.repositories

import ebayapp.monitor.domain.{Monitor, MonitoringEvent}
import mongo4cats.bson.ObjectId

import java.time.Instant
import scala.concurrent.duration.FiniteDuration

final private[repositories] case class MonitoringEventEntity(
    _id: ObjectId,
    monitorId: ObjectId,
    status: Monitor.Status,
    responseTime: FiniteDuration,
    time: Instant,
    reason: String
):
  def toDomain: MonitoringEvent =
    MonitoringEvent(Monitor.Id(monitorId), status, responseTime, time, reason)

private[repositories] object MonitoringEventEntity:
  def from(me: MonitoringEvent): MonitoringEventEntity =
    MonitoringEventEntity(
      ObjectId(),
      me.monitorId.toObjectId,
      me.status,
      me.responseTime,
      me.time,
      me.reason
    )
