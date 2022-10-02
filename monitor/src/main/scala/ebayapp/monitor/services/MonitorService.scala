package ebayapp.monitor.services

import cats.effect.Concurrent
import cats.effect.std.Queue
import cats.syntax.flatMap.*
import ebayapp.kernel.errors.AppError
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.domain.{CreateMonitor, Monitor}
import ebayapp.monitor.repositories.{MonitorRepository, MonitoringEventRepository}
import fs2.Stream

trait MonitorService[F[_]]:
  def rescheduleAll: F[Unit]
  def reschedule(id: Monitor.Id): F[Unit]
  def getAll: F[List[Monitor]]
  def create(monitor: CreateMonitor): F[Monitor]
  def find(id: Monitor.Id): F[Option[Monitor]]
  def update(monit: Monitor): F[Unit]
  def activate(id: Monitor.Id, active: Boolean): F[Unit]
  def delete(id: Monitor.Id): F[Unit]

final private class LiveMonitorService[F[_]](
    private val dispatcher: ActionDispatcher[F],
    private val repository: MonitorRepository[F]
)(using
    F: Concurrent[F]
) extends MonitorService[F] {
  def find(id: Monitor.Id): F[Option[Monitor]]           = repository.find(id)
  def delete(id: Monitor.Id): F[Unit]                    = repository.delete(id)
  def getAll: F[List[Monitor]]                           = repository.all
  def update(monitor: Monitor): F[Unit]                  = repository.update(monitor)
  def activate(id: Monitor.Id, active: Boolean): F[Unit] = repository.activate(id, active)
  def create(monitor: CreateMonitor): F[Monitor]         = repository.save(monitor).flatTap(dispatchQuery)
  def rescheduleAll: F[Unit]                             = repository.stream.evalMap(dispatchSchedule).compile.drain

  def reschedule(id: Monitor.Id): F[Unit] =
    repository.find(id).flatMap {
      case Some(monitor) => dispatchSchedule(monitor)
      case None          => F.raiseError(AppError.NotFound(s"Monitor with id $id does not exist"))
    }

  private def dispatchSchedule(m: Monitor): F[Unit] = dispatcher.dispatch(Action.Schedule(m))
  private def dispatchQuery(m: Monitor): F[Unit]    = dispatcher.dispatch(Action.Query(m, None))
}

object MonitorService:
  def make[F[_]: Concurrent](dispatcher: ActionDispatcher[F], repository: MonitorRepository[F]): F[MonitorService[F]] =
    Concurrent[F].pure(LiveMonitorService[F](dispatcher, repository))
