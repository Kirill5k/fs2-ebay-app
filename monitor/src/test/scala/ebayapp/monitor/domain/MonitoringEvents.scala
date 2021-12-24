package ebayapp.monitor.domain

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
      lastUpStatusCheck: Option[MonitoringEvent.StatusCheck] = None
  ): MonitoringEvent = MonitoringEvent(Monitors.id, statusCheck, lastUpStatusCheck)
