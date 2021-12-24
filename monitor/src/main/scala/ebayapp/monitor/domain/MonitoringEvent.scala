package ebayapp.monitor.domain

import java.time.Instant
import scala.concurrent.duration.FiniteDuration

final case class MonitoringEvent(
    monitorId: Monitor.Id,
    statusCheck: MonitoringEvent.StatusCheck,
    downTime: Option[Instant]
)

object MonitoringEvent {
  final case class StatusCheck(
      status: Monitor.Status,
      responseTime: FiniteDuration,
      time: Instant,
      reason: String
  )
}
