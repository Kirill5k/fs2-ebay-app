package ebayapp.monitor.actions

import ebayapp.monitor.domain.Monitor

enum Action:
  case ScheduleAll
  case Schedule(id: Monitor.Id, previousStatus: Option[Monitor.Status])
