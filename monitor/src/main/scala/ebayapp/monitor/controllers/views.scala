package ebayapp.monitor.controllers

import ebayapp.monitor.common.JsonCodecs
import io.circe.Codec
import ebayapp.monitor.domain.{Monitor, MonitoringEvent, CreateMonitor}

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

  final case class CreateMonitorRequest(
      name: String,
      connection: Monitor.Connection,
      interval: FiniteDuration,
      contact: Monitor.Contact
  ) derives Codec.AsObject:
    def toDomain: CreateMonitor = CreateMonitor(Monitor.Name(name), connection, interval, contact)
  
  final case class CreateMonitorResponse(id: String) derives Codec.AsObject
  
  final case class ActivateMonitorRequest(active: Boolean) derives Codec.AsObject
}
