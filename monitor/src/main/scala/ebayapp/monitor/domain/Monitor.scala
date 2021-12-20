package ebayapp.monitor.domain

import java.util.UUID
import java.net.URL
import scala.concurrent.duration.FiniteDuration

type Url = java.net.URL
object Url {
  def apply(host: String) = new URL(host)
}

final case class Monitor(
    id: Monitor.Id,
    name: Monitor.Name,
    url: Url,
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
  }
}
