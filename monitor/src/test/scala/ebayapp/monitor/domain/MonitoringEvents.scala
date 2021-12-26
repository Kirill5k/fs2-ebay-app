package ebayapp.monitor.domain

import ebayapp.monitor.domain.MonitoringEvents.ts
import mongo4cats.bson.ObjectId

import java.time.Instant
import java.time.temporal.ChronoUnit
import scala.concurrent.duration.*

object MonitoringEvents:

  def ts          = Instant.now().truncatedTo(ChronoUnit.MILLIS)
  def statusCheck = MonitoringEvent.StatusCheck(Monitor.Status.Up, 125.millis, ts, "Up and running")

  def gen(
      monitorId: Monitor.Id = Monitors.id,
      statusCheck: MonitoringEvent.StatusCheck = statusCheck,
      downTime: Option[Instant] = None
  ): MonitoringEvent = MonitoringEvent(Monitors.id, statusCheck, downTime)

  def up(
      monitorId: Monitor.Id = Monitors.id,
      ts: Instant = ts,
      reason: String = "OK"
  ): MonitoringEvent = MonitoringEvent(Monitors.id, MonitoringEvent.StatusCheck(Monitor.Status.Up, 125.millis, ts, reason), None)

  def down(
      monitorId: Monitor.Id = Monitors.id,
      ts: Instant = ts,
      reason: String = "DOWN",
      downTime: Option[Instant] = Some(ts)
  ): MonitoringEvent = MonitoringEvent(Monitors.id, MonitoringEvent.StatusCheck(Monitor.Status.Down, 125.millis, ts, reason), downTime)

  def paused(
      monitorId: Monitor.Id = Monitors.id,
      ts: Instant = ts
  ): MonitoringEvent = MonitoringEvent(Monitors.id, MonitoringEvent.StatusCheck(Monitor.Status.Paused, 0.millis, ts, "Paused"), None)
