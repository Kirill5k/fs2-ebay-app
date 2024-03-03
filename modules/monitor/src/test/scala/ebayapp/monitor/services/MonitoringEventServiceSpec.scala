package ebayapp.monitor.services

import cats.effect.IO
import ebayapp.kernel.{Clock, MockClock}
import kirill5k.common.syntax.time.*
import kirill5k.common.test.cats.IOWordSpec
import ebayapp.monitor.MockActionDispatcher
import ebayapp.monitor.actions.Action
import ebayapp.monitor.clients.HttpClient
import ebayapp.monitor.domain.{Monitor, MonitoringEvent, MonitoringEvents, Monitors, Notification}
import ebayapp.monitor.repositories.MonitoringEventRepository
import org.scalatest.Assertion

import java.time.Instant
import scala.concurrent.Future
import scala.concurrent.duration.*

class MonitoringEventServiceSpec extends IOWordSpec {

  val downTime = Instant.parse("2011-01-01T00:00:00Z")

  val now         = Instant.parse("2020-01-01T00:00:00Z")
  given Clock[IO] = MockClock[IO](now)

  "A MonitoringEventService" when {
    "schedule" should {
      "dispatch query action if monitor has no previous events" in {
        val (disp, repo, http) = mocks
        when(repo.findLatestBy(any[Monitor.Id])).thenReturn(IO.none)

        val result = for
          svc <- MonitoringEventService.make(disp, repo, http)
          _   <- svc.schedule(Monitors.monitor)
        yield ()

        result.asserting { res =>
          verify(repo).findLatestBy(Monitors.id)
          disp.submittedActions mustBe List(Action.Query(Monitors.monitor, None))
          res mustBe ()
        }
      }

      "dispatch query action if monitor hasn't been queried for longer than duration until next execution" in {
        val (disp, repo, http) = mocks
        val monitor            = Monitors.gen()
        val event              = MonitoringEvents.up(ts = now.minus(monitor.schedule.durationUntilNextExecutionTime(now) + 10.seconds))
        when(repo.findLatestBy(any[Monitor.Id])).thenReturn(IO.some(event))

        val result = for
          svc <- MonitoringEventService.make(disp, repo, http)
          _   <- svc.schedule(monitor)
        yield ()

        result.asserting { res =>
          verify(repo).findLatestBy(monitor.id)
          disp.submittedActions mustBe List(Action.Query(monitor, Some(event)))
          res mustBe ()
        }
      }

      "reschedule monitor if it was checked recently" in {
        val (disp, repo, http)    = mocks
        val monitor               = Monitors.gen()
        val event                 = MonitoringEvents.up(ts = now.minusSeconds(30))
        val durationUntilNextExec = monitor.schedule.durationUntilNextExecutionTime(event.statusCheck.time)
        when(repo.findLatestBy(any[Monitor.Id])).thenReturn(IO.some(event))

        val result = for
          svc <- MonitoringEventService.make(disp, repo, http)
          _   <- svc.schedule(monitor)
        yield ()

        result.asserting { res =>
          verify(repo).findLatestBy(monitor.id)
          disp.submittedActions mustBe List(Action.Reschedule(monitor.id, durationUntilNextExec - 30.seconds))
          res mustBe ()
        }
      }
    }

    "query" should {
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
        "clear downtime and do not send notification" in {
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
  }

  def runScenarioWhenMonitorIsActive(
      currentStatusCheck: MonitoringEvent.StatusCheck,
      previousEvent: Option[MonitoringEvent],
      expectedEvent: MonitoringEvent,
      notification: Option[Notification]
  ): Future[Assertion] = {
    val monitor            = Monitors.monitor
    val (disp, repo, http) = mocks
    when(repo.save(any[MonitoringEvent])).thenReturnUnit
    when(http.status(any[Monitor.Connection.Http])).thenReturn(IO.pure(currentStatusCheck))

    val result = for
      svc <- MonitoringEventService.make[IO](disp, repo, http)
      _   <- svc.query(monitor, previousEvent)
    yield ()

    result.asserting { res =>
      if (notification.isDefined) {
        disp.submittedActions mustBe List(
          Action.Notify(monitor, notification.get),
          Action.Reschedule(monitor.id, monitor.schedule.durationUntilNextExecutionTime(currentStatusCheck.time))
        )
      } else {
        disp.submittedActions mustBe List(
          Action.Reschedule(monitor.id, monitor.schedule.durationUntilNextExecutionTime(currentStatusCheck.time))
        )
      }
      verify(http).status(Monitors.httpConnection)
      verify(repo).save(expectedEvent)
      res mustBe ()
    }
  }

  def runScenarioWhenMonitorIsInactive(
      previousEvent: Option[MonitoringEvent]
  ): Future[Assertion] = {
    val monitor            = Monitors.monitor.copy(active = false)
    val (disp, repo, http) = mocks
    when(repo.save(any[MonitoringEvent])).thenReturnUnit

    val result = for
      svc <- MonitoringEventService.make[IO](disp, repo, http)
      _   <- svc.query(monitor, previousEvent)
    yield ()

    result.asserting { res =>
      disp.submittedActions mustBe List(Action.Reschedule(Monitors.id, 10.minutes))
      verifyNoMoreInteractions(http)
      verify(repo).save(any[MonitoringEvent])
      res mustBe ()
    }
  }

  def mocks: (MockActionDispatcher[IO], MonitoringEventRepository[IO], HttpClient[IO]) =
    (MockActionDispatcher.make[IO], mock[MonitoringEventRepository[IO]], mock[HttpClient[IO]])
}
