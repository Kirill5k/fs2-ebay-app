package ebayapp.monitor.domain

import java.time.Instant

final case class Notification(
    status: Monitor.Status,
    time: Instant,
    downTime: Option[Instant],
    reason: String
):
  val isUp: Boolean        = Monitor.Status.Up == status
  val statusString: String = status.toString.toUpperCase
  val timeString: String   = time.toString.replace("T", " ")
