package ebayapp.core.common

import cats.effect.Temporal
import fs2.Stream

import scala.concurrent.duration.FiniteDuration

object stream {

  extension (S: Stream.type)
    def logError[F[_]](error: Throwable)(message: String)(using logger: Logger[F]): Stream[F, Nothing] =
      S.eval(logger.error(error)(message)).drain
    def logError[F[_]](message: String)(using logger: Logger[F]): Stream[F, Nothing] =
      S.eval(logger.error(message)).drain
    def logInfo[F[_]](message: String)(using logger: Logger[F]): Stream[F, Nothing] =
      S.eval(logger.info(message)).drain

  extension [F[_], A](stream: Stream[F, A])
    def repeatEvery(delay: FiniteDuration)(using T: Temporal[F]): Stream[F, A] =
      (stream ++ Stream.sleep_(delay)).repeat

    def throttle(time: FiniteDuration)(using T: Temporal[F]): Stream[F, A] =
      stream
        .zip(Stream.every[F](time))
        .scan[Option[A]](None) {
          case (_, (n, true)) => Some(n)
          case (_, (_, _))    => None
        }
        .unNone

}
