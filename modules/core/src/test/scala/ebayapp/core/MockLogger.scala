package ebayapp.core

import cats.effect.{IO, Sync}
import ebayapp.core.common.{Error, Logger}
import org.typelevel.log4cats.slf4j.Slf4jLogger
import fs2.Stream

object MockLogger {
  given logger: Logger[IO] = MockLogger.make[IO]

  def make[F[_]: Sync]: Logger[F] = new Logger[F] {
    private val l = Slf4jLogger.getLogger[F]

    override def critical(message: => String): F[Unit]               = l.error(message)
    override def critical(t: Throwable)(message: => String): F[Unit] = l.error(t)(message)
    override def error(t: Throwable)(message: => String): F[Unit]    = l.error(t)(message)
    override def error(message: => String): F[Unit]                  = l.error(message)
    override def warn(message: => String): F[Unit]                   = l.warn(message)
    override def info(message: => String): F[Unit]                   = l.info(message)
    override def warn(t: Throwable)(message: => String): F[Unit]     = l.warn(t)(message)

    override def info(t: Throwable)(message: => String): F[Unit]  = ???
    override def debug(t: Throwable)(message: => String): F[Unit] = ???
    override def trace(t: Throwable)(message: => String): F[Unit] = ???
    override def debug(message: => String): F[Unit]               = ???
    override def trace(message: => String): F[Unit]               = ???

    override def errors: fs2.Stream[F, Error]             = Stream.empty
    override def awaitSigTerm: F[Either[Throwable, Unit]] = Sync[F].pure(Right(()))
  }
}
