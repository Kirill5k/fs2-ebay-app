package ebayapp.monitor.controllers

import io.circe.Codec
import ebayapp.monitor.domain.Monitor

object views {

  final case class MonitorView() derives Codec.AsObject

  object MonitorView:
    def from(monitor: Monitor): MonitorView = MonitorView()
}
