package ebayapp.monitor.domain

import java.time.Instant

final case class Notification(
    status: Monitor.Status,
    time: Instant,
    downTime: Option[Instant],
    reason: String
)
