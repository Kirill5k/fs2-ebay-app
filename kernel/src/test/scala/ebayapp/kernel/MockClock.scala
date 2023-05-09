package ebayapp.kernel

import cats.Monad
import ebayapp.kernel.syntax.time.*

import java.time.Instant
import scala.concurrent.duration.FiniteDuration

object MockClock {

  def apply[F[_]: Monad](timestamp: Instant): Clock[F] =
    new Clock[F]:
      override def now: F[Instant] =
        Monad[F].pure(timestamp)
      override def durationBetweenNowAnd(time: Instant): F[FiniteDuration] =
        Monad[F].pure(time.durationBetween(timestamp))
}
