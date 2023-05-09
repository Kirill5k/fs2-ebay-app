package ebayapp.kernel

import cats.effect.{Async, Temporal}
import cats.syntax.functor.*
import ebayapp.kernel.syntax.time.*

import java.time.Instant
import scala.concurrent.duration.FiniteDuration

trait Clock[F[_]]:
  def now: F[Instant]
  def durationBetweenNowAnd(time: Instant): F[FiniteDuration]

final private class LiveClock[F[_]](using F: Temporal[F]) extends Clock[F] {

  override def now: F[Instant] =
    F.realTimeInstant

  override def durationBetweenNowAnd(time: Instant): F[FiniteDuration] =
    now.map(_.durationBetween(time))

}

object Clock:
  def apply[F[_]: Temporal]: Clock[F] = new LiveClock[F]()
