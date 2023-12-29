package ebayapp.kernel.syntax

import cats.{Applicative, Functor}
import cats.syntax.functor.*

object effects:
  extension[F[_], A] (fo: F[Option[A]])
    def mapOpt[B](f: A => B)(using F: Functor[F]): F[Option[B]] =
      fo.map(_.map(f))

  extension[F[_], A] (fo: F[Iterable[A]])
    def mapList[B](f: A => B)(using F: Functor[F]): F[List[B]] =
      fo.map(_.map(f).toList)
  
  extension [F[_]](F: Applicative[F])
    def ifTrueOrElse[A](cond: Boolean)(ifTrue: => F[A], ifFalse: => F[A]): F[A] =
      if (cond) ifTrue else ifFalse
