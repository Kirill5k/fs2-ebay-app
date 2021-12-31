package ebayapp.proxy.common

import cats.effect.{Deferred, Ref, Temporal}
import cats.effect.kernel.Temporal
import cats.syntax.applicativeError._
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import ebayapp.kernel.controllers.HealthController
import org.typelevel.log4cats.Logger

import java.time.Instant

trait Interrupter[F[_]]:
  def terminate: F[Unit]
  def awaitSigTerm: F[Either[Throwable, Unit]]

final private class LiveInterrupter[F[_]](
    private val startupTime: Ref[F, Instant],
    private val sigTerm: Deferred[F, Unit]
)(implicit
    F: Temporal[F],
    logger: Logger[F]
) extends Interrupter[F]:
  def terminate: F[Unit]                       = logger.info("received termination signal") >> sigTerm.complete(()).void
  def awaitSigTerm: F[Either[Throwable, Unit]] = sigTerm.get.attempt

object Interrupter:
  def make[F[_]: Logger](implicit F: Temporal[F]): F[Interrupter[F]] =
    for
      ts      <- F.realTimeInstant
      sigTerm <- Deferred[F, Unit]
      ref     <- Ref.of(ts)
    yield LiveInterrupter[F](ref, sigTerm)
