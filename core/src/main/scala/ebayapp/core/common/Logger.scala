package ebayapp.core.common

import cats.Monad
import cats.effect.std.Queue
import cats.effect.{Async, Deferred}
import cats.syntax.apply._
import ebayapp.core.common.errors.AppError
import fs2.Stream
import org.typelevel.log4cats.slf4j.Slf4jLogger
import org.typelevel.log4cats.{Logger => Logger4Cats}

import java.time.Instant

final case class Error(
    message: String,
    time: Instant = Instant.now()
)

trait Logger[F[_]] extends Logger4Cats[F] {
  def errors: Stream[F, Error]
  def awaitSigTerm: F[Either[Throwable, Unit]]
  def critical(message: => String): F[Unit]
  def critical(t: Throwable)(message: => String): F[Unit]
}

final private class LiveLogger[F[_]: Monad](
    private val logger: Logger4Cats[F],
    private val loggedErrors: Queue[F, Error],
    private val sigTerm: Deferred[F, Either[Throwable, Unit]]
) extends Logger[F] {

  private def enqueue(t: Throwable, message: => String): F[Unit] =
    enqueue(s"${message.split("\n").head} - ${t.getMessage}")

  private def enqueue(message: => String): F[Unit] =
    loggedErrors.offer(Error(message.split("\n").head))

  override def awaitSigTerm: F[Either[Throwable, Unit]] =
    sigTerm.get

  override def errors: Stream[F, Error] =
    Stream.fromQueueUnterminated(loggedErrors)

  override def critical(message: => String): F[Unit] =
    sigTerm.complete(Left(AppError.Critical(message))) *> error(message)

  override def critical(t: Throwable)(message: => String): F[Unit] =
    sigTerm.complete(Left(t)) *> error(t)(message)

  override def error(t: Throwable)(message: => String): F[Unit] =
    enqueue(t, message) *> logger.error(t)(message)

  override def error(message: => String): F[Unit] =
    enqueue(message) *> logger.error(message)

  override def warn(t: Throwable)(message: => String): F[Unit] =
    logger.warn(t)(message)

  override def info(t: Throwable)(message: => String): F[Unit] =
    logger.info(t)(message)

  override def debug(t: Throwable)(message: => String): F[Unit] =
    logger.debug(t)(message)

  override def trace(t: Throwable)(message: => String): F[Unit] =
    logger.trace(t)(message)

  override def warn(message: => String): F[Unit] =
    logger.warn(message)

  override def info(message: => String): F[Unit] =
    logger.info(message)

  override def debug(message: => String): F[Unit] =
    logger.debug(message)

  override def trace(message: => String): F[Unit] =
    logger.trace(message)
}

object Logger {
  def apply[F[_]](implicit ev: Logger[F]): Logger[F] = ev

  def make[F[_]: Async]: F[Logger[F]] =
    (Queue.unbounded[F, Error], Deferred[F, Either[Throwable, Unit]])
      .mapN((q, s) => new LiveLogger[F](Slf4jLogger.getLogger[F], q, s))
}
