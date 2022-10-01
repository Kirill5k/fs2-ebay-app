package ebayapp.monitor.domain

import ebayapp.monitor.domain.Monitors.id
import mongo4cats.bson.ObjectId

import scala.concurrent.duration.*

object Monitors {
  lazy val id: Monitor.Id                          = Monitor.Id(ObjectId())
  lazy val httpConnection: Monitor.Connection.Http = Monitor.Connection.Http(Url("http://foo.bar"), HttpMethod.GET, 60.seconds)
  lazy val emailContact: Monitor.Contact.Email     = Monitor.Contact.Email("foo@bar.com")

  lazy val monitor: Monitor = Monitor(id, Monitor.Name("test"), httpConnection, true, 10.minutes, emailContact)

  def genId: Monitor.Id = Monitor.Id(ObjectId())

  def gen(
      id: Monitor.Id = genId,
      name: Monitor.Name = Monitor.Name("test"),
      connection: Monitor.Connection = httpConnection,
      active: Boolean = true,
      interval: FiniteDuration = 10.minutes,
      contact: Monitor.Contact = emailContact
  ): Monitor = Monitor(id, name, connection, active, interval, contact)

  def create(
      name: Monitor.Name = Monitor.Name("test"),
      connection: Monitor.Connection = httpConnection,
      interval: FiniteDuration = 10.minutes,
      contact: Monitor.Contact = emailContact
  ): CreateMonitor = CreateMonitor(name, connection, interval, contact)
}
