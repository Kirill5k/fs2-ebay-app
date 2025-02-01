package ebayapp.proxy.common

import cats.effect.{Deferred, Temporal}
import cats.effect.kernel.Temporal
import cats.syntax.applicativeError.*
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import kirill5k.common.cats.Clock
import kirill5k.common.syntax.time.*
import ebayapp.proxy.common.config.InterrupterConfig
import org.typelevel.log4cats.Logger

import java.time.Instant
import scala.concurrent.duration.*

trait Interrupter[F[_]]:
  def terminate: F[Unit]
  def awaitSigTerm: F[Either[Throwable, Unit]]

final private class LiveInterrupter[F[_]: Temporal](
    private val initialDelay: FiniteDuration,
    private val startupTime: Instant,
    private val sigTerm: Deferred[F, Unit]
)(implicit
    clock: Clock[F],
    logger: Logger[F]
) extends Interrupter[F] {
  def terminate: F[Unit] =
    clock.now
      .map(_ durationBetween startupTime)
      .flatMap { duration =>
        if (duration < initialDelay) logger.info(s"delaying termination as the app has started ${duration.toMinutes} min ago")
        else logger.info("terminating app") >> sigTerm.complete(()).void
      }

  def awaitSigTerm: F[Either[Throwable, Unit]] =
    sigTerm.get.attempt
}

object Interrupter:
  def make[F[_]: Temporal: Logger: Clock](config: InterrupterConfig): F[Interrupter[F]] =
    for
      ts      <- Clock[F].now
      sigTerm <- Deferred[F, Unit]
    yield LiveInterrupter[F](config.initialDelay, ts, sigTerm)
