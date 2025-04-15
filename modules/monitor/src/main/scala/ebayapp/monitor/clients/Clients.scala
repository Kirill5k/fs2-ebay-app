package ebayapp.monitor.clients

import cats.effect.Async
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.monitor.Resources

trait Clients[F[_]]:
  def email: EmailClient[F]
  def http: HttpClient[F]

object Clients:
  def make[F[_]: Async](resources: Resources[F]): F[Clients[F]] =
    for
      hc <- HttpClient.make[F](resources.fs2Backed)
      ec <- EmailClient.make[F](resources.mailer)
    yield new Clients[F]:
      def email: EmailClient[F] = ec
      def http: HttpClient[F]   = hc
