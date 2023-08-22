package ebayapp.monitor.domain

import java.time.Instant
import scala.concurrent.duration.{Duration, FiniteDuration}

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
  object StatusCheck {
    def paused(time: Instant): StatusCheck =
      StatusCheck(Monitor.Status.Paused, Duration.Zero, time, "Paused")
  }
}
