package ebayapp.kernel.common

import cats.Applicative

object effects {

  extension [F[_]](F: Applicative[F])
    def ifTrueOrElse[A](cond: Boolean)(ifTrue: => F[A], ifFalse: => F[A]): F[A] =
      if (cond) ifTrue else ifFalse
}
