package ebayapp.monitor.actions

import ebayapp.monitor.domain.{Monitor, MonitoringEvent, Notification}

import scala.concurrent.duration.FiniteDuration

enum Action:
  case RescheduleAll
  case Schedule(monitor: Monitor)
  case Reschedule(id: Monitor.Id, interval: FiniteDuration)
  case Query(monitor: Monitor, previousEvent: Option[MonitoringEvent])
  case Notify(monitor: Monitor, notification: Notification)
