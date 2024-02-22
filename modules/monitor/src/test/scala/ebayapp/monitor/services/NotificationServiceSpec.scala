package ebayapp.monitor.services

import cats.effect.IO
import ebayapp.kernel.IOWordSpec
import ebayapp.monitor.clients.{EmailClient, EmailMessage}
import ebayapp.monitor.domain.{Monitor, Monitors, Notification}
import org.typelevel.log4cats.Logger
import org.typelevel.log4cats.slf4j.Slf4jLogger

import java.time.Instant

class NotificationServiceSpec extends IOWordSpec {

  given logger: Logger[IO] = Slf4jLogger.getLogger[IO]

  val downTime  = Instant.parse("2022-01-01T00:00:00Z")
  val eventTime = Instant.parse("2022-01-01T01:15:00Z")

  "A NotificationService" should {
    "email monitor is UP notification" in {
      val emailClient = mock[EmailClient[IO]]
      when(emailClient.send(any[EmailMessage])).thenReturnUnit

      val result = for
        svc <- NotificationService.make[IO](emailClient)
        _   <- svc.notify(Monitors.monitor, Notification(Monitor.Status.Up, eventTime, Some(downTime), "HTTP 200 Success"))
      yield ()

      result.asserting { res =>
        val h = "Monitor is UP: test"
        val m =
          "The monitor test (GET http://foo.bar) is back UP (HTTP 200 Success)\nIt was down for 1h15m\nEvent timestamp: 2022-01-01 01:15:00"
        verify(emailClient).send(EmailMessage(Monitors.emailContact.email, h, m))
        res mustBe ()
      }
    }

    "email monitor is DOWN notification" in {
      val emailClient = mock[EmailClient[IO]]
      when(emailClient.send(any[EmailMessage])).thenReturnUnit

      val result = for
        svc <- NotificationService.make[IO](emailClient)
        _   <- svc.notify(Monitors.monitor, Notification(Monitor.Status.Down, eventTime, None, "HTTP 500 Internal Error"))
      yield ()

      result.asserting { res =>
        val h = "Monitor is DOWN: test"
        val m = "The monitor test (GET http://foo.bar) is currently DOWN (HTTP 500 Internal Error)\nEvent timestamp: 2022-01-01 01:15:00"
        verify(emailClient).send(EmailMessage(Monitors.emailContact.email, h, m))
        res mustBe ()
      }
    }
  }
}
