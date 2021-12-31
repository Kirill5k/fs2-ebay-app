package ebayapp.monitor.clients

import cats.Monad
import cats.effect.Async
import courier.{Envelope, Mailer, Text}
import ebayapp.monitor.MailerF
import ebayapp.monitor.domain.Monitor

import javax.mail.internet.InternetAddress

trait EmailClient[F[_]]:
  def send(contact: Monitor.Contact.Email, subject: String, message: String): F[Unit]

final private class LiveEmailClient[F[_]](
    private val mailer: MailerF[F]
)(using
    F: Async[F]
) extends EmailClient[F]:
  def send(contact: Monitor.Contact.Email, subject: String, message: String): F[Unit] =
    mailer.send {
      Envelope
        .from(new InternetAddress(mailer.from))
        .to(new InternetAddress(contact.email))
        .subject(subject)
        .content(Text(message))
    }

object EmailClient:
  def make[F[_]: Async](mailer: MailerF[F]): F[EmailClient[F]] =
    Monad[F].pure(LiveEmailClient[F](mailer))
