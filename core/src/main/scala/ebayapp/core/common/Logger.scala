package ebayapp.core.common

import cats.effect.std.Queue
import cats.effect.{Async, Deferred, Temporal}
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.kernel.errors.AppError
import fs2.Stream
import org.typelevel.log4cats.slf4j.Slf4jLogger
import org.typelevel.log4cats.Logger as Logger4Cats

import java.time.Instant
import scala.concurrent.duration.*

final case class Error(
    message: String,
    time: Instant
)

trait Logger[F[_]] extends Logger4Cats[F]:
  def errors: Stream[F, Error]
  def awaitSigTerm: F[Either[Throwable, Unit]]
  def critical(message: => String): F[Unit]
  def critical(t: Throwable)(message: => String): F[Unit]

final private class LiveLogger[F[_]](
    private val logger: Logger4Cats[F],
    private val loggedErrors: Queue[F, Error],
    private val sigTerm: Deferred[F, Either[Throwable, Unit]],
    private val warningsCache: Cache[F, String, Unit],
    private val errorsCache: Cache[F, String, Unit]
)(using
    F: Temporal[F]
) extends Logger[F] {

  private def enqueueError(t: Throwable, message: => String): F[Unit] =
    enqueueError(s"${message.split("\n").head} - ${t.getMessage}")

  private def enqueueError(message: => String): F[Unit] =
    F.realTimeInstant.flatMap(time => loggedErrors.offer(Error(message.split("\n").head, time)))

  override def awaitSigTerm: F[Either[Throwable, Unit]] =
    sigTerm.get

  override def errors: Stream[F, Error] =
    Stream.fromQueueUnterminated(loggedErrors)

  override def critical(message: => String): F[Unit] =
    sigTerm.complete(Left(AppError.Critical(message))) >> 
      error(message)

  override def critical(t: Throwable)(message: => String): F[Unit] =
    sigTerm.complete(Left(t)) >> 
      error(t)(message)

  override def error(t: Throwable)(message: => String): F[Unit] =
    errorsCache.evalIfNew(message) {
      errorsCache.put(message, ()) >> 
        enqueueError(t, message) >> 
        logger.error(t)(message)
    }

  override def error(message: => String): F[Unit] =
    errorsCache.evalIfNew(message) {
      errorsCache.put(message, ()) >> 
        enqueueError(message) >> 
        logger.error(message)
    }

  override def warn(t: Throwable)(message: => String): F[Unit] =
    warningsCache.evalIfNew(message) {
      warningsCache.put(message, ()) >> 
        logger.warn(t)(message)
    }

  override def info(t: Throwable)(message: => String): F[Unit] =
    logger.info(t)(message)

  override def debug(t: Throwable)(message: => String): F[Unit] =
    logger.debug(t)(message)

  override def trace(t: Throwable)(message: => String): F[Unit] =
    logger.trace(t)(message)

  override def warn(message: => String): F[Unit] =
    warningsCache.evalIfNew(message) {
      warningsCache.put(message, ()) >> 
        logger.warn(message)
    }

  override def info(message: => String): F[Unit] =
    logger.info(message)

  override def debug(message: => String): F[Unit] =
    logger.debug(message)

  override def trace(message: => String): F[Unit] =
    logger.trace(message)
}

object Logger:
  def apply[F[_]](using ev: Logger[F]): Logger[F] = ev

  def make[F[_]: Async]: F[Logger[F]] =
    for
      loggedErrors  <- Queue.unbounded[F, Error]
      sigTerm       <- Deferred[F, Either[Throwable, Unit]]
      warningsCache <- Cache.make[F, String, Unit](3.minute, 10.seconds)
      errorsCache   <- Cache.make[F, String, Unit](1.minute, 10.seconds)
    yield LiveLogger[F](Slf4jLogger.getLogger[F], loggedErrors, sigTerm, warningsCache, errorsCache)
