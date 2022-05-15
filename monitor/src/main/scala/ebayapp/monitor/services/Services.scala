package ebayapp.monitor.services

import cats.effect.Temporal
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.monitor.actions.ActionDispatcher
import ebayapp.monitor.clients.Clients
import ebayapp.monitor.domain.{Monitor, MonitoringEvent, Notification}
import ebayapp.monitor.repositories.Repositories
import org.typelevel.log4cats.Logger
import fs2.Stream

trait Services[F[_]]:
  def monitor: MonitorService[F]
  def monitoringEvent: MonitoringEventService[F]
  def notification: NotificationService[F]

object Services:
  def make[F[_]: Temporal: Logger](
      dispatcher: ActionDispatcher[F],
      clients: Clients[F],
      repositories: Repositories[F]
  ): F[Services[F]] =
    for
      mon <- MonitorService.make[F](dispatcher, repositories.monitor)
      me  <- MonitoringEventService.make[F](dispatcher, repositories.monitoringEvent, clients.http)
      not <- NotificationService.make[F](clients.email)
    yield new Services[F] {
      def monitor: MonitorService[F]                 = mon
      def monitoringEvent: MonitoringEventService[F] = me
      def notification: NotificationService[F]       = not
    }
