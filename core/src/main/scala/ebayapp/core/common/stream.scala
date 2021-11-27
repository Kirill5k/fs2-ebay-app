package ebayapp.core.common

import cats.effect.Temporal
import fs2.Stream

import scala.concurrent.duration.FiniteDuration

object stream {

  extension [F[_], A](stream: Stream[F, A])
    def repeatEvery(delay: FiniteDuration)(implicit T: Temporal[F]): Stream[F, A] =
      (stream ++ Stream.sleep_(delay)).repeat

    def throttle(time: FiniteDuration)(implicit T: Temporal[F]): Stream[F, A] =
      stream
        .zip(Stream.every[F](time))
        .scan[Option[A]](None) {
          case (_, (n, true)) => Some(n)
          case (_, (_, _))    => None
        }
        .unNone

}
