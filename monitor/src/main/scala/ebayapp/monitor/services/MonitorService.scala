package ebayapp.monitor.services

import cats.Monad
import cats.effect.std.Queue
import cats.syntax.flatMap.*
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.domain.{CreateMonitor, Monitor}
import ebayapp.monitor.repositories.{MonitorRepository, MonitoringEventRepository}
import fs2.Stream

trait MonitorService[F[_]]:
  def getAll: F[List[Monitor]]
  def getAllActive: F[List[Monitor]]
  def create(monitor: CreateMonitor): F[Monitor]
  def find(id: Monitor.Id): F[Option[Monitor]]
  def activate(id: Monitor.Id, active: Boolean): F[Unit]

final private class LiveMonitorService[F[_]: Monad](
    private val dispatcher: ActionDispatcher[F],
    private val repository: MonitorRepository[F]
) extends MonitorService[F]:
  def find(id: Monitor.Id): F[Option[Monitor]]           = repository.find(id)
  def getAll: F[List[Monitor]]                           = repository.getAll
  def getAllActive: F[List[Monitor]]                     = repository.getAllActive
  def activate(id: Monitor.Id, active: Boolean): F[Unit] = repository.activate(id, active)
  def create(monitor: CreateMonitor): F[Monitor] =
    repository.save(monitor).flatTap(m => dispatcher.dispatch(Action.EnqueueNew(m)))

object MonitorService:
  def make[F[_]: Monad](dispatcher: ActionDispatcher[F], repository: MonitorRepository[F]): F[MonitorService[F]] =
    Monad[F].pure(LiveMonitorService[F](dispatcher, repository))
