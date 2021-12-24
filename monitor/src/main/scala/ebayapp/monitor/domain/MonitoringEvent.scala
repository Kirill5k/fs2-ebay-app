package ebayapp.monitor.domain

import java.time.Instant
import scala.concurrent.duration.FiniteDuration

final case class MonitoringEvent(
    monitorId: Monitor.Id,
    status: Monitor.Status,
    responseTime: FiniteDuration,
    time: Instant,
    reason: String
)
