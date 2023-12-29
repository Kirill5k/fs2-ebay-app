package ebayapp.monitor.clients

import cats.Monad
import courier.{Envelope, Text}
import ebayapp.monitor.Mailer

import javax.mail.internet.InternetAddress

final case class EmailMessage(
    to: String,
    subject: String,
    body: String
)

trait EmailClient[F[_]]:
  def send(message: EmailMessage): F[Unit]

final private class LiveEmailClient[F[_]](
    private val mailer: Mailer[F]
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
  def make[F[_]: Monad](mailer: Mailer[F]): F[EmailClient[F]] =
    Monad[F].pure(LiveEmailClient[F](mailer))
