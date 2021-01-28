package ebayapp.common

import cats.Monad
import cats.effect.Concurrent
import cats.implicits._
import fs2.concurrent.Queue
import io.chrisdavenport.log4cats.{Logger => Logger4Cats}
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger

import java.time.Instant

final case class Alert(
    message: String,
    time: Instant
)

trait Logger[F[_]] extends Logger4Cats[F] {
  def critical(message: => String): F[Unit]
}

final private class LiveLogger[F[_]: Monad](
    private val logger: Logger4Cats[F],
    val alerts: Queue[F, Alert]
) extends Logger[F] {
  override def critical(message: => String): F[Unit] =
    alerts.enqueue1(Alert(message, Instant.now())) *> error(message)

  override def error(t: Throwable)(message: => String): F[Unit] =
    logger.error(t)(message)

  override def warn(t: Throwable)(message: => String): F[Unit] =
    logger.warn(t)(message)

  override def info(t: Throwable)(message: => String): F[Unit] =
    logger.info(t)(message)

  override def debug(t: Throwable)(message: => String): F[Unit] =
    logger.debug(t)(message)

  override def trace(t: Throwable)(message: => String): F[Unit] =
    logger.trace(t)(message)

  override def error(message: => String): F[Unit] =
    logger.error(message)

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

  def make[F[_]: Concurrent]: F[Logger[F]] =
    Queue
      .unbounded[F, Alert]
      .map(queue => new LiveLogger[F](Slf4jLogger.getLogger[F], queue))
}
