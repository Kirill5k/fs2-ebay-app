package ebayapp.monitor.repositories

import cats.effect.Async
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import mongo4cats.database.MongoDatabase

trait Repositories[F[_]]:
  def monitor: MonitorRepository[F]
  def monitoringEvent: MonitoringEventRepository[F]

object Repositories:
  def make[F[_]: Async](database: MongoDatabase[F]): F[Repositories[F]] =
    for
      mon <- MonitorRepository.make[F](database)
      me  <- MonitoringEventRepository.make[F](database)
    yield new Repositories[F]:
      def monitor: MonitorRepository[F]                 = mon
      def monitoringEvent: MonitoringEventRepository[F] = me
