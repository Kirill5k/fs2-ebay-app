package ebayapp.monitor.services

import cats.Monad
import cats.effect.std.Queue
import cats.syntax.flatMap._
import ebayapp.monitor.actions.{Action, ActionDispatcher}
import ebayapp.monitor.domain.{CreateMonitor, Monitor}
import ebayapp.monitor.repositories.{MonitorRepository, MonitoringEventRepository}
import fs2.Stream

trait MonitorService[F[_]]:
  def getAllActive: F[List[Monitor]]
  def create(monitor: CreateMonitor): F[Monitor]
  def find(id: Monitor.Id): F[Option[Monitor]]

final private class LiveMonitorService[F[_]: Monad](
    private val dispatcher: ActionDispatcher[F],
    private val repository: MonitorRepository[F]
) extends MonitorService[F]:
  def find(id: Monitor.Id): F[Option[Monitor]] = repository.find(id)
  def getAllActive: F[List[Monitor]]           = repository.getAllActive
  def create(monitor: CreateMonitor): F[Monitor] =
    repository.save(monitor).flatTap(m => dispatcher.dispatch(Action.EnqueueNew(m)))

object MonitorService:
  def make[F[_]: Monad](dispatcher: ActionDispatcher[F], repository: MonitorRepository[F]): F[MonitorService[F]] =
    Monad[F].pure(LiveMonitorService[F](dispatcher, repository))
