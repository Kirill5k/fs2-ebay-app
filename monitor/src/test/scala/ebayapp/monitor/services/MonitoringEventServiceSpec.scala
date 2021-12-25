package ebayapp.monitor.services

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.kernel.MockitoMatchers
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.clients.HttpClient
import ebayapp.monitor.domain.{Monitor, MonitoringEvent, MonitoringEvents, Monitors, Notification}
import ebayapp.monitor.repositories.{MonitorRepository, MonitoringEventRepository}
import org.scalatest.Assertion
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar
import java.time.Instant

import scala.concurrent.Future
import scala.concurrent.duration.*

class MonitoringEventServiceSpec extends AsyncWordSpec with Matchers with MockitoMatchers with MockitoSugar {

  val downTime = Instant.parse("2011-01-01T00:00:00Z")

  "A MonitoringEventService" when {
    "UP - DOWN" should {
      "clear downtime and send notification" in {
        val statusCheck   = MonitoringEvents.up().statusCheck
        val previousEvent = Some(MonitoringEvents.down(downTime = Some(downTime)))
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, None)
        val notification  = Notification(Monitor.Status.Up, statusCheck.time, Some(downTime), statusCheck.reason)

        runScenario(statusCheck, previousEvent, expectedEvent, Some(notification))
      }
    }

    "UP - UP" should {
      "no downtime and no notification" in {
        val statusCheck   = MonitoringEvents.up().statusCheck
        val previousEvent = Some(MonitoringEvents.up())
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, None)

        runScenario(statusCheck, previousEvent, expectedEvent, None)
      }
    }

    "UP - None" should {
      "no downtime and no notification" in {
        pending
      }
    }

    "DOWN - DOWN" should {
      "keep downtime and no notification" in {
        pending
      }
    }

    "DOWN - UP" should {
      "record downtime and send notification" in {
        pending
      }
    }

    "DOWN - None" should {
      "record downtime and no notification" in {
        pending
      }
    }
  }

  def runScenario(
      currentStatusCheck: MonitoringEvent.StatusCheck,
      previousEvent: Option[MonitoringEvent],
      expectedEvent: MonitoringEvent,
      notification: Option[Notification]
  ): Future[Assertion] = {
    val (disp, repo, http) = (mock[ActionDispatcher[IO]], mock[MonitoringEventRepository[IO]], mock[HttpClient[IO]])
    when(disp.dispatch(any[Action])).thenReturn(IO.unit)
    when(repo.save(any[MonitoringEvent])).thenReturn(IO.unit)
    when(http.status(any[Monitor.Connection.Http])).thenReturn(IO.pure(currentStatusCheck))

    val result = for
      svc <- MonitoringEventService.make[IO](disp, repo, http)
      _   <- svc.enqueue(Monitors.gen(), previousEvent)
      _   <- svc.process.interruptAfter(250.millis).compile.drain
    yield ()

    result.unsafeToFuture().map { res =>
      verify(http).status(Monitors.httpConnection)
      verify(disp).dispatch(Action.Requeue(Monitors.id, Monitors.gen().interval, expectedEvent))
      notification.fold(verifyNoMoreInteractions(disp))(n => verify(disp).dispatch(Action.Notify(Monitors.gen(), n)))
      verify(repo).save(expectedEvent)
      res mustBe ()
    }
  }
}
