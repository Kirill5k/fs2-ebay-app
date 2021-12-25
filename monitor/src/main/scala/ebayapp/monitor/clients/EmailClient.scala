package ebayapp.monitor.clients

import cats.Monad
import cats.effect.Async
import ebayapp.monitor.domain.Monitor

trait EmailClient[F[_]]:
  def send(contact: Monitor.Contact.Email, header: String, message: String): F[Unit]

final private class LiveEmailClient[F[_]]()(using
  F: Async[F]
) extends EmailClient[F]:
  def send(contact: Monitor.Contact.Email, header: String, message: String): F[Unit] =
    F.raiseError(new IllegalArgumentException("Not implemented yet"))

object EmailClient:
  def make[F[_]: Async]: F[EmailClient[F]] =
    Monad[F].pure(LiveEmailClient())