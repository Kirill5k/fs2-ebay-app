package ebayapp.monitor.clients

import cats.Monad
import cats.effect.Async
import courier.{Envelope, Mailer, Text}
import ebayapp.monitor.MailerF
import ebayapp.monitor.domain.Monitor

import javax.mail.internet.InternetAddress

final case class EmailMessage(
    to: String,
    subject: String,
    body: String
)

trait EmailClient[F[_]]:
  def send(message: EmailMessage): F[Unit]

final private class LiveEmailClient[F[_]](
    private val mailer: MailerF[F]
)(using
    F: Async[F]
) extends EmailClient[F]:
  def send(message: EmailMessage): F[Unit] =
    mailer.send {
      Envelope
        .from(new InternetAddress(mailer.from))
        .to(new InternetAddress(message.to))
        .subject(message.subject)
        .content(Text(message.body))
    }

object EmailClient:
  def make[F[_]: Async](mailer: MailerF[F]): F[EmailClient[F]] =
    Monad[F].pure(LiveEmailClient[F](mailer))
