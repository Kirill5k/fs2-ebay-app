package ebayapp.monitor.repositories

import ebayapp.monitor.domain.MonitorEvent

final private[repositories] case class MonitorEventEntity(
):
  def toDomain: MonitorEvent = ???

private[repositories] object MonitorEventEntity:
  def from(me: MonitorEvent): MonitorEventEntity =
    MonitorEventEntity()
