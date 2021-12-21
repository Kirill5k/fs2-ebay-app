package ebayapp.monitor.domain

import java.util.UUID
import scala.concurrent.duration.FiniteDuration

type Url = java.net.URL
object Url {
  def apply(host: String): Url = new java.net.URL(host)
}

final case class Monitor(
    id: Monitor.Id,
    name: Monitor.Name,
    connection: Monitor.Connection,
    interval: FiniteDuration,
    timeout: FiniteDuration,
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
    case Http(url: Url, method: HttpMethod)
  }

  enum HttpMethod {
    case GET, POST, PUT, DELETE, PATCH, HEAD
  }
}
