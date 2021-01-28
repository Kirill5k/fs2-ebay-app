package ebayapp

import cats.effect.Sync
import ebayapp.common.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger

object MockLogger {

  def make[F[_]: Sync]: Logger[F] = new Logger[F] {
    private val l = Slf4jLogger.getLogger[F]

    override def critical(message: => String): F[Unit] = l.error(message)
    override def error(t: Throwable)(message: => String): F[Unit] = l.error(t)(message)
    override def error(message: => String): F[Unit] = l.error(message)
    override def warn(message: => String): F[Unit] = l.warn(message)
    override def info(message: => String): F[Unit] = l.info(message)

    override def warn(t: Throwable)(message: => String): F[Unit] = ???
    override def info(t: Throwable)(message: => String): F[Unit] = ???
    override def debug(t: Throwable)(message: => String): F[Unit] = ???
    override def trace(t: Throwable)(message: => String): F[Unit] = ???
    override def debug(message: => String): F[Unit] = ???
    override def trace(message: => String): F[Unit] = ???
  }
}
