package ebayapp.monitor.services

import cats.Monad
import cats.effect.Concurrent
import ebayapp.kernel.common.time.*
import ebayapp.monitor.clients.{EmailClient, EmailMessage}
import ebayapp.monitor.domain.Monitor.Contact
import ebayapp.monitor.domain.{Monitor, Notification}
import org.typelevel.log4cats.Logger

import java.time.Duration

trait NotificationService[F[_]]:
  def notify(monitor: Monitor, notification: Notification): F[Unit]

final private class LiveNotificationService[F[_]](
    private val emailClient: EmailClient[F]
)(using
    F: Concurrent[F],
    logger: Logger[F]
) extends NotificationService[F]:
  def notify(monitor: Monitor, notification: Notification): F[Unit] =
    val msg1        = s"The monitor ${monitor.name} (${monitor.connection.asString}) "
    val msg2        = s"is ${if notification.isUp then "back" else "currently"} ${notification.statusString} (${notification.reason})\n"
    val msg3        = notification.downTime.fold("")(dt => s"It was down for ${dt.durationBetween(notification.time).toCoarsest}\n")
    val msg4        = s"Event timestamp: ${notification.timeString}"
    val completeMsg = s"$msg1$msg2$msg3$msg4"
    monitor.contact match
      case Contact.Logging   => logger.info(completeMsg)
      case Contact.Email(to) => emailClient.send(EmailMessage(to, s"Monitor is ${notification.statusString}: ${monitor.name}", completeMsg))
      case contact           => F.raiseError(new IllegalArgumentException(s"Contact $contact is not yet supported"))

object NotificationService:
  def make[F[_]: Logger: Concurrent](emailClient: EmailClient[F]): F[NotificationService[F]] =
    Monad[F].pure(LiveNotificationService[F](emailClient))
