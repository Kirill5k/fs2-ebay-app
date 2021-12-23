package ebayapp.monitor.domain

import mongo4cats.bson.ObjectId

import scala.concurrent.duration._

object Monitors {

  lazy val id                = Monitor.Id(ObjectId())
  lazy val httpConnection    = Monitor.Connection.Http(Url("http://foo.bar"), HttpMethod.GET, 60.seconds)
  lazy val emailNotification = Monitor.Notification.Email("foo@bar.com")

  def gen(
      id: Monitor.Id = id,
      name: Monitor.Name = Monitor.Name("test"),
      connection: Monitor.Connection = httpConnection,
      active: Boolean = true,
      interval: FiniteDuration = 10.minutes,
      notification: Monitor.Notification = emailNotification
  ) = Monitor(id, name, connection, active, 10.minutes, notification)
}
