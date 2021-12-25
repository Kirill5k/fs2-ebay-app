package ebayapp.monitor.domain

import ebayapp.monitor.domain.Monitors.id
import mongo4cats.bson.ObjectId

import scala.concurrent.duration.*

object Monitors {

  lazy val id: Monitor.Id                          = Monitor.Id(ObjectId())
  lazy val httpConnection: Monitor.Connection.Http = Monitor.Connection.Http(Url("http://foo.bar"), HttpMethod.GET, 60.seconds)
  lazy val emailNotification: Monitor.Contact      = Monitor.Contact.Email("foo@bar.com")

  def gen(
      id: Monitor.Id = id,
      name: Monitor.Name = Monitor.Name("test"),
      connection: Monitor.Connection = httpConnection,
      active: Boolean = true,
      interval: FiniteDuration = 10.minutes,
      notification: Monitor.Contact = emailNotification
  ): Monitor = Monitor(id, name, connection, active, 10.minutes, notification)

  def create(
      name: Monitor.Name = Monitor.Name("test"),
      connection: Monitor.Connection = httpConnection,
      interval: FiniteDuration = 10.minutes,
      notification: Monitor.Contact = emailNotification
  ): CreateMonitor = CreateMonitor(name, connection, 10.minutes, notification)
}
