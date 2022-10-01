package ebayapp.monitor.services

import cats.effect.IO
import ebayapp.kernel.errors.AppError
import ebayapp.monitor.IOWordSpec
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.domain.{CreateMonitor, Monitor, Monitors}
import ebayapp.monitor.repositories.MonitorRepository
import fs2.Stream

class MonitorServiceSpec extends IOWordSpec {

  "A MonitorService" should {
    "create new monitors and dispatch an action" in {
      val (dispatcher, repo) = mocks
      when(dispatcher.dispatch(any[Action])).thenReturn(IO.unit)
      when(repo.save(any[CreateMonitor])).thenReturn(IO.pure(Monitors.monitor))

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        mon <- svc.create(Monitors.create())
      yield mon

      res.asserting { mon =>
        verify(dispatcher).dispatch(Action.Query(Monitors.monitor, None))
        verify(repo).save(Monitors.create())
        mon mustBe Monitors.monitor
      }
    }

    "update monitor" in {
      val (dispatcher, repo) = mocks
      when(repo.update(any[Monitor])).thenReturn(IO.unit)

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        _   <- svc.update(Monitors.monitor)
      yield ()

      res.asserting { res =>
        verifyNoInteractions(dispatcher)
        verify(repo).update(Monitors.monitor)
        res mustBe ()
      }
    }

    "find monitor by id" in {
      val (dispatcher, repo) = mocks
      when(repo.find(any[Monitor.Id])).thenReturn(IO.some(Monitors.monitor))

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        mon <- svc.find(Monitors.id)
      yield mon

      res.asserting { mon =>
        verifyNoInteractions(dispatcher)
        verify(repo).find(Monitors.id)
        mon mustBe Some(Monitors.monitor)
      }
    }

    "delete monitor by id" in {
      val (dispatcher, repo) = mocks
      when(repo.delete(any[Monitor.Id])).thenReturn(IO.unit)

      val result = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        res <- svc.delete(Monitors.id)
      yield res

      result.asserting { res =>
        verifyNoInteractions(dispatcher)
        verify(repo).delete(Monitors.id)
        res mustBe ()
      }
    }

    "get all monitors" in {
      val (dispatcher, repo) = mocks
      val monitors           = List(Monitors.gen(), Monitors.gen())
      when(repo.all).thenReturn(IO.pure(monitors))

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        mon <- svc.getAll
      yield mon

      res.asserting { mons =>
        verifyNoInteractions(dispatcher)
        verify(repo).all
        mons mustBe monitors
      }
    }

    "activate monitor" in {
      val (dispatcher, repo) = mocks
      when(repo.activate(any[Monitor.Id], any[Boolean])).thenReturn(IO.unit)

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        mon <- svc.activate(Monitors.id, true)
      yield mon

      res.asserting { mon =>
        verifyNoInteractions(dispatcher)
        verify(repo).activate(Monitors.id, true)
        mon mustBe ()
      }
    }

    // TODO: what to do with inactive monitors?
    "reschedule all active monitors" in {
      val (dispatcher, repo) = mocks
      val mon1               = Monitors.gen()
      val mon2               = Monitors.gen()
      when(repo.stream).thenReturn(Stream(mon1, mon2))
      when(dispatcher.dispatch(any[Action])).thenReturn(IO.unit)

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        _   <- svc.rescheduleAll
      yield ()

      res.asserting { res =>
        verify(repo).stream
        verify(dispatcher).dispatch(Action.Schedule(mon1))
        verify(dispatcher).dispatch(Action.Schedule(mon2))
        res mustBe ()
      }
    }

    "reschedule single monitor" in {
      val (dispatcher, repo) = mocks
      when(repo.find(any[Monitor.Id])).thenReturn(IO.some(Monitors.monitor))
      when(dispatcher.dispatch(any[Action])).thenReturn(IO.unit)

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        _   <- svc.reschedule(Monitors.id)
      yield ()

      res.asserting { res =>
        verify(repo).find(Monitors.id)
        verify(dispatcher).dispatch(Action.Schedule(Monitors.monitor))
        res mustBe ()
      }
    }

    "return error when rescheduled monitor is not found" in {
      val (dispatcher, repo) = mocks
      when(repo.find(any[Monitor.Id])).thenReturn(IO.none)

      val res = for
        svc <- MonitorService.make[IO](dispatcher, repo)
        _   <- svc.reschedule(Monitors.id)
      yield ()

      res.attempt.asserting { res =>
        verify(repo).find(Monitors.id)
        verifyNoInteractions(dispatcher)
        res mustBe Left(AppError.NotFound(s"Monitor with id ${Monitors.id} does not exist"))
      }
    }
  }

  def mocks: (ActionDispatcher[IO], MonitorRepository[IO]) =
    (mock[ActionDispatcher[IO]], mock[MonitorRepository[IO]])
}
