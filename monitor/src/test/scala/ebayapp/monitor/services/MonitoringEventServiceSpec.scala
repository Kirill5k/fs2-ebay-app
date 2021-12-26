package ebayapp.monitor.services

import cats.Applicative
import cats.effect.{Clock, IO}
import cats.effect.kernel.Temporal
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
import org.typelevel.log4cats.Logger
import org.typelevel.log4cats.slf4j.Slf4jLogger

import java.time.Instant
import scala.concurrent.Future
import scala.concurrent.duration.*

class MonitoringEventServiceSpec extends AsyncWordSpec with Matchers with MockitoMatchers with MockitoSugar {

  given logger: Logger[IO] = Slf4jLogger.getLogger[IO]

  val downTime = Instant.parse("2011-01-01T00:00:00Z")

  "A MonitoringEventService" when {
    "DOWN - PAUSED" should {
      "record downtime and no notification" in {
        val statusCheck   = MonitoringEvents.down().statusCheck
        val previousEvent = Some(MonitoringEvents.paused())
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, Some(statusCheck.time))

        runScenarioWhenMonitorIsActive(statusCheck, previousEvent, expectedEvent, None)
      }
    }

    "UP - PAUSED" should {
      "clear downtime and no notification" in {
        val statusCheck   = MonitoringEvents.up().statusCheck
        val previousEvent = Some(MonitoringEvents.paused())
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, None)

        runScenarioWhenMonitorIsActive(statusCheck, previousEvent, expectedEvent, None)
      }
    }

    "PAUSED - _" should {
      "clear downtime and no notification" in {
        val previousEvent = Some(MonitoringEvents.down(downTime = Some(downTime)))

        runScenarioWhenMonitorIsInactive(previousEvent)
      }
    }

    "UP - DOWN" should {
      "clear downtime and send notification" in {
        val statusCheck   = MonitoringEvents.up().statusCheck
        val previousEvent = Some(MonitoringEvents.down(downTime = Some(downTime)))
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, None)
        val notification  = Notification(Monitor.Status.Up, statusCheck.time, Some(downTime), statusCheck.reason)

        runScenarioWhenMonitorIsActive(statusCheck, previousEvent, expectedEvent, Some(notification))
      }
    }

    "UP - UP" should {
      "no downtime and no notification" in {
        val statusCheck   = MonitoringEvents.up().statusCheck
        val previousEvent = Some(MonitoringEvents.up())
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, None)

        runScenarioWhenMonitorIsActive(statusCheck, previousEvent, expectedEvent, None)
      }
    }

    "UP - None" should {
      "no downtime and no notification" in {
        val statusCheck   = MonitoringEvents.up().statusCheck
        val previousEvent = None
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, None)

        runScenarioWhenMonitorIsActive(statusCheck, previousEvent, expectedEvent, None)
      }
    }

    "DOWN - DOWN" should {
      "keep downtime and no notification" in {
        val statusCheck   = MonitoringEvents.down().statusCheck
        val previousEvent = Some(MonitoringEvents.down(downTime = Some(downTime)))
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, Some(downTime))

        runScenarioWhenMonitorIsActive(statusCheck, previousEvent, expectedEvent, None)
      }
    }

    "DOWN - UP" should {
      "record downtime and send notification" in {
        val statusCheck   = MonitoringEvents.down().statusCheck
        val previousEvent = Some(MonitoringEvents.up())
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, Some(statusCheck.time))
        val notification  = Notification(Monitor.Status.Down, statusCheck.time, None, statusCheck.reason)

        runScenarioWhenMonitorIsActive(statusCheck, previousEvent, expectedEvent, Some(notification))
      }
    }

    "DOWN - None" should {
      "record downtime and no notification" in {
        val statusCheck   = MonitoringEvents.down().statusCheck
        val previousEvent = None
        val expectedEvent = MonitoringEvent(Monitors.id, statusCheck, Some(statusCheck.time))

        runScenarioWhenMonitorIsActive(statusCheck, previousEvent, expectedEvent, None)
      }
    }
  }

  def runScenarioWhenMonitorIsActive(
      currentStatusCheck: MonitoringEvent.StatusCheck,
      previousEvent: Option[MonitoringEvent],
      expectedEvent: MonitoringEvent,
      notification: Option[Notification]
  ): Future[Assertion] = {
    val monitor            = Monitors.gen()
    val (disp, repo, http) = (mock[ActionDispatcher[IO]], mock[MonitoringEventRepository[IO]], mock[HttpClient[IO]])
    when(disp.dispatch(any[Action])).thenReturn(IO.unit)
    when(repo.save(any[MonitoringEvent])).thenReturn(IO.unit)
    when(http.status(any[Monitor.Connection.Http])).thenReturn(IO.pure(currentStatusCheck))

    val result = for
      svc <- MonitoringEventService.make[IO](disp, repo, http)
      _   <- svc.enqueue(monitor, previousEvent)
      _   <- svc.process.interruptAfter(250.millis).compile.drain
    yield ()

    result.unsafeToFuture().map { res =>
      verify(http).status(Monitors.httpConnection)
      verify(disp).dispatch(Action.Requeue(monitor.id, monitor.interval, expectedEvent))
      notification.fold(verifyNoMoreInteractions(disp))(n => verify(disp).dispatch(Action.Notify(monitor, n)))
      verify(repo).save(expectedEvent)
      res mustBe ()
    }
  }

  def runScenarioWhenMonitorIsInactive(
      previousEvent: Option[MonitoringEvent]
  ): Future[Assertion] = {
    val monitor            = Monitors.gen(active = false)
    val (disp, repo, http) = (mock[ActionDispatcher[IO]], mock[MonitoringEventRepository[IO]], mock[HttpClient[IO]])
    when(disp.dispatch(any[Action])).thenReturn(IO.unit)
    when(repo.save(any[MonitoringEvent])).thenReturn(IO.unit)

    val result = for
      svc <- MonitoringEventService.make[IO](disp, repo, http)
      _   <- svc.enqueue(monitor, previousEvent)
      _   <- svc.process.interruptAfter(250.millis).compile.drain
    yield ()

    result.unsafeToFuture().map { res =>
      verify(disp).dispatch(any[Action.Requeue])
      verifyNoMoreInteractions(http, disp)
      verify(repo).save(any[MonitoringEvent])
      res mustBe ()
    }
  }
}
