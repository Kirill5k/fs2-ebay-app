package ebayapp.monitor.domain

import mongo4cats.bson.ObjectId

import java.time.Instant
import java.time.temporal.ChronoUnit
import scala.concurrent.duration.*

object MonitoringEvents:

  def gen(
      monitorId: Monitor.Id = Monitors.id,
      status: Monitor.Status = Monitor.Status.Up,
      responseTime: FiniteDuration = 125.millis,
      time: Instant = Instant.now().truncatedTo(ChronoUnit.MILLIS),
      reason: String = "Up and running"
  ): MonitoringEvent = MonitoringEvent(Monitors.id, status, responseTime, time, reason)
