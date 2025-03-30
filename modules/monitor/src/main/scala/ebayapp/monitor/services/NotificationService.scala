package ebayapp.monitor.services

import cats.Monad
import cats.effect.Concurrent
import cats.syntax.applicativeError.*
import kirill5k.common.syntax.time.*
import ebayapp.monitor.clients.{EmailClient, EmailMessage}
import ebayapp.monitor.domain.Monitor.Contact
import ebayapp.monitor.domain.{Monitor, Notification}
import org.typelevel.log4cats.Logger

trait NotificationService[F[_]]:
  def notify(monitor: Monitor, notification: Notification): F[Unit]

final private class LiveNotificationService[F[_]](
    private val emailClient: EmailClient[F]
)(using
    F: Concurrent[F],
    logger: Logger[F]
) extends NotificationService[F] {
  def notify(mon: Monitor, not: Notification): F[Unit] =
    (mon.contact match
      case Contact.Logging   => logger.info(not.messageFor(mon))
      case Contact.Email(to) => emailClient.send(EmailMessage(to, s"Monitor is ${not.statusString}: ${mon.name}", not.messageFor(mon)))
    ).handleErrorWith(e => logger.error(e)(s"error sending notification for monitor id=${mon.id} status change"))

  extension (notification: Notification)
    def messageFor(monitor: Monitor): String = {
      val msg1 = s"The monitor ${monitor.name} (${monitor.connection.asString}) "
      val msg2 = s"is ${if notification.isUp then "back" else "currently"} ${notification.statusString} (${notification.reason})\n"
      val msg3 = notification.downTime.fold("")(dt => s"It was down for ${dt.durationBetween(notification.time).toReadableString}\n")
      val msg4 = s"Event timestamp: ${notification.timeString}"
      s"$msg1$msg2$msg3$msg4"
    }
}

object NotificationService:
  def make[F[_]: {Logger, Concurrent}](emailClient: EmailClient[F]): F[NotificationService[F]] =
    Monad[F].pure(LiveNotificationService[F](emailClient))
