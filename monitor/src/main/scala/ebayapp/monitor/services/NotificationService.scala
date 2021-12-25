package ebayapp.monitor.services

import cats.Monad
import cats.effect.Concurrent
import ebayapp.monitor.domain.Monitor.Contact
import ebayapp.monitor.domain.{Monitor, Notification}
import org.typelevel.log4cats.Logger
import java.time.Duration

trait NotificationService[F[_]]:
  def notify(monitor: Monitor, notification: Notification): F[Unit]

final private class LiveNotificationService[F[_]]()(using
    F: Concurrent[F],
    logger: Logger[F]
) extends NotificationService[F]:
  def notify(monitor: Monitor, notification: Notification): F[Unit] =
    val msg1        = s"The monitor ${monitor.name} (${monitor.connection.asString}) "
    val msg2        = s"is ${if notification.isUp then "back" else "currently"} ${notification.statusString} (${notification.reason})\n"
    val msg3        = notification.downTime.fold("")(dt => s"It was down for ${Duration.between(dt, notification.time).toString}\n")
    val msg4        = s"Event timestamp: ${notification.timeString}"
    val completeMsg = s"$msg1$msg2$msg3$msg4"
    monitor.contact match
      case Contact.Logging =>
        logger.info(completeMsg)
      case Contact.Email(email)        => ???
      case Contact.Telegram(channelId) => ???

object NotificationService:
  def make[F[_]: Logger: Concurrent]: F[NotificationService[F]] =
    Monad[F].pure(LiveNotificationService[F]())
