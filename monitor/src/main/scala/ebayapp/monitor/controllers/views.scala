package ebayapp.monitor.controllers

import ebayapp.monitor.common.JsonCodecs
import io.circe.Codec
import ebayapp.monitor.domain.{Monitor, MonitoringEvent}

import java.time.Instant
import scala.concurrent.duration.FiniteDuration

private[controllers] object views extends JsonCodecs {

  final case class MonitorView(
      id: String,
      name: String,
      active: Boolean,
      interval: FiniteDuration,
      connection: Monitor.Connection,
      contact: Monitor.Contact
  ) derives Codec.AsObject

  object MonitorView:
    def from(monitor: Monitor): MonitorView =
      MonitorView(
        monitor.id.value,
        monitor.name.value,
        monitor.active,
        monitor.interval,
        monitor.connection,
        monitor.contact
      )

  final case class MonitoringEventView(
      monitorId: String,
      status: Monitor.Status,
      responseTime: FiniteDuration,
      time: Instant,
      reason: String,
      downTime: Option[Instant]
  ) derives Codec.AsObject

  object MonitoringEventView:
    def from(event: MonitoringEvent): MonitoringEventView =
      MonitoringEventView(
        event.monitorId.value,
        event.statusCheck.status,
        event.statusCheck.responseTime,
        event.statusCheck.time,
        event.statusCheck.reason,
        event.downTime
      )
}
