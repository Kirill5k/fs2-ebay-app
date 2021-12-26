package ebayapp.monitor.controllers

import io.circe.Codec
import ebayapp.monitor.domain.{Monitor, MonitoringEvent}

object views {

  final case class MonitorView() derives Codec.AsObject

  object MonitorView:
    def from(monitor: Monitor): MonitorView = MonitorView()

  final case class MonitoringEventView() derives Codec.AsObject

  object MonitoringEventView:
    def from(event: MonitoringEvent): MonitoringEventView = MonitoringEventView()
}
