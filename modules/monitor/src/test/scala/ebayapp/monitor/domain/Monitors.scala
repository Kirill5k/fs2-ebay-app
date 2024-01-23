package ebayapp.monitor.domain

import mongo4cats.bson.ObjectId

import scala.concurrent.duration.*

object Monitors {
  lazy val id: Monitor.Id                          = Monitor.Id(ObjectId())
  lazy val httpConnection: Monitor.Connection.Http = Monitor.Connection.Http(Url("http://foo.bar"), HttpMethod.GET, 60.seconds)
  lazy val emailContact: Monitor.Contact.Email     = Monitor.Contact.Email("foo@bar.com")
  lazy val periodicSchedule: Monitor.Schedule      = Monitor.Schedule.Periodic(10.minutes)

  lazy val monitor: Monitor = Monitor(id, Monitor.Name("test"), httpConnection, true, periodicSchedule, emailContact)

  def genId: Monitor.Id = Monitor.Id(ObjectId())

  def gen(
      id: Monitor.Id = genId,
      name: Monitor.Name = Monitor.Name("test"),
      connection: Monitor.Connection = httpConnection,
      active: Boolean = true,
      schedule: Monitor.Schedule = periodicSchedule,
      contact: Monitor.Contact = emailContact
  ): Monitor = Monitor(id, name, connection, active, schedule, contact)

  def create(
      name: Monitor.Name = Monitor.Name("test"),
      connection: Monitor.Connection = httpConnection,
      schedule: Monitor.Schedule = periodicSchedule,
      contact: Monitor.Contact = emailContact
  ): CreateMonitor = CreateMonitor(name, connection, schedule, contact)
}
