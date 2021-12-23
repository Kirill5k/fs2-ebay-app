package ebayapp.monitor.actions

import ebayapp.monitor.domain.Monitor

import scala.concurrent.duration.FiniteDuration

enum Action:
  case EnqueueAll
  case Enqueue(monitor: Monitor, previousStatus: Option[Monitor.Status])
  case Requeue(id: Monitor.Id, interval: FiniteDuration, previousStatus: Option[Monitor.Status])
