package ebayapp.common

import cats.effect.Timer
import fs2.Stream

import scala.concurrent.duration.FiniteDuration

object stream {

  implicit class StreamOps[F[_], A] (private val stream: Stream[F, A]) {

    def repeatEvery(delay: FiniteDuration)(implicit T: Timer[F]): Stream[F, A] =
      (stream ++ Stream.sleep_(delay)).repeat
  }
}
