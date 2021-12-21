package ebayapp.monitor.domain

import java.util.UUID
import java.time.Instant
import scala.concurrent.duration.FiniteDuration

type Url = java.net.URL
object Url {
  def apply(host: String): Url = new java.net.URL(host)
}

enum HttpMethod {
  case GET, POST, PUT, DELETE, PATCH, HEAD
}

final case class Monitor(
    id: Monitor.Id,
    name: Monitor.Name,
    connection: Monitor.Connection,
    active: Boolean,
    interval: FiniteDuration,
    notification: Monitor.Notification
)

object Monitor {
  opaque type Id = String
  object Id {
    def gen: Id = UUID.randomUUID().toString
  }

  opaque type Name = String
  object Name {
    def apply(name: String): Name = name
  }

  enum Notification {
    case Email(email: String)
    case Telegram(channelId: String)
  }

  enum Connection {
    case Http(url: Url, method: HttpMethod, timeout: FiniteDuration)
  }

  enum Status {
    case Up, Down
  }
}

final case class MonitorEvent(
    monitorId: Monitor.Id,
    status: Monitor.Status,
    responseTime: FiniteDuration,
    time: Instant,
    reason: String
)
