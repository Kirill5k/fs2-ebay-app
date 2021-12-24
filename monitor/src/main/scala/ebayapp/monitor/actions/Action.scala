package ebayapp.monitor.actions

import ebayapp.monitor.domain.{Monitor, MonitoringEvent, Notification}

import scala.concurrent.duration.FiniteDuration

enum Action:
  case EnqueueAll
  case EnqueueNew(monitor: Monitor)
  case Enqueue(monitor: Monitor, previousEvent: MonitoringEvent)
  case Requeue(id: Monitor.Id, interval: FiniteDuration, previousEvent: MonitoringEvent)
  case Notify(monitor: Monitor, notification: Notification)
