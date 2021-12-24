package ebayapp.monitor.services

import cats.effect.IO
import cats.effect.unsafe.implicits.global
import ebayapp.kernel.MockitoMatchers
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.domain.{CreateMonitor, Monitors, Monitor}
import ebayapp.monitor.repositories.MonitorRepository
import org.scalatest.wordspec.AsyncWordSpec
import org.scalatest.matchers.must.Matchers
import org.scalatestplus.mockito.MockitoSugar

class MonitorServiceSpec extends AsyncWordSpec with Matchers with MockitoSugar with MockitoMatchers {

  "A MonitorService" should {
    "create new monitors and dispatch an action" in {
      val (dispatcher, repo) = mocks
      when(dispatcher.dispatch(any[Action])).thenReturn(IO.unit)
      when(repo.save(any[CreateMonitor])).thenReturn(IO.pure(Monitors.gen()))

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        mon <- svc.create(Monitors.create())
      yield mon

      res.unsafeToFuture().map { mon =>
        verify(dispatcher).dispatch(Action.EnqueueNew(Monitors.gen()))
        verify(repo).save(Monitors.create())
        mon mustBe Monitors.gen()
      }
    }

    "find monitor by id" in {
      val (dispatcher, repo) = mocks
      when(repo.find(any[Monitor.Id])).thenReturn(IO.pure(Monitors.gen()))

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        mon <- svc.find(Monitors.id)
      yield mon

      res.unsafeToFuture().map { mon =>
        verifyNoInteractions(dispatcher)
        verify(repo).find(Monitors.id)
        mon mustBe Monitors.gen()
      }
    }

    "get all active monitors" in {
      val (dispatcher, repo) = mocks
      when(repo.getAllActive).thenReturn(IO.pure(List(Monitors.gen(), Monitors.gen())))

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        mon <- svc.getAllActive
      yield mon

      res.unsafeToFuture().map { mons =>
        verifyNoInteractions(dispatcher)
        verify(repo).getAllActive
        mons mustBe List(Monitors.gen(), Monitors.gen())
      }
    }
  }

  def mocks: (ActionDispatcher[IO], MonitorRepository[IO]) =
    (mock[ActionDispatcher[IO]], mock[MonitorRepository[IO]])
}
