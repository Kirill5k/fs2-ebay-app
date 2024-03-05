package ebayapp.kernel

import cats.Monad
import kirill5k.common.syntax.time.*
import kirill5k.common.cats.Clock

import java.time.Instant
import scala.concurrent.duration.FiniteDuration

final private class MockClock[F[_]: Monad](
    private var timestamp: Instant
)(using
    M: Monad[F]
) extends Clock[F] {
  def set(newTimestamp: Instant): Unit = {
    timestamp = newTimestamp
    ()
  }

  override def now: F[Instant]                                         = M.pure(timestamp)
  override def durationBetweenNowAnd(otherTs: Instant): F[FiniteDuration] = M.pure(otherTs.durationBetween(timestamp))
  override def sleep(duration: FiniteDuration): F[Unit]                = M.pure(set(timestamp.plusNanos(duration.toNanos)))
}

object MockClock {
  def apply[F[_]: Monad](timestamp: Instant): Clock[F] = new MockClock[F](timestamp)
}
