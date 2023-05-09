package ebayapp.core.common

import cats.Monad
import cats.effect.{Ref, Temporal}
import cats.effect.syntax.spawn.*
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.applicative.*
import ebayapp.kernel.Clock

import scala.concurrent.duration.FiniteDuration

trait Cache[F[_], K, V]:
  def size: F[Int]
  def clear: F[Unit]
  def values: F[List[V]]
  def get(key: K): F[Option[V]]
  def put(key: K, value: V): F[Unit]
  def contains(key: K): F[Boolean]
  def evalIfNew(key: K)(fa: => F[Unit]): F[Unit]
  def evalPutIfNew(key: K)(fa: => F[V]): F[V]

final private class RefbasedCache[F[_]: Clock: Monad, K, V](
    private val state: Ref[F, Map[K, (V, Long)]]
) extends Cache[F, K, V] {

  override def get(key: K): F[Option[V]] =
    state.get.map(_.get(key).map(_._1))

  override def put(key: K, value: V): F[Unit] =
    for
      ts <- Clock[F].now
      _  <- state.update(_ + (key -> (value -> ts.toEpochMilli)))
    yield ()

  override def contains(key: K): F[Boolean] =
    state.get.map(_.contains(key))

  override def evalIfNew(key: K)(fa: => F[Unit]): F[Unit] =
    contains(key).flatMap(if _ then ().pure[F] else fa)

  override def evalPutIfNew(key: K)(fa: => F[V]): F[V] =
    get(key).flatMap {
      case Some(v) => v.pure[F]
      case None    => fa.flatTap(v => put(key, v))
    }

  override def values: F[List[V]] =
    state.get.map(_.values.map(_._1).toList)

  override def size: F[Int] = state.get.map(_.size)
  
  override def clear: F[Unit] = state.set(Map.empty)
}

object Cache:
  def make[F[_]: Temporal, K, V](
      expiresIn: FiniteDuration,
      checkOnEvery: FiniteDuration
  )(using C: Clock[F]): F[Cache[F, K, V]] = {

    def checkExpirations(state: Ref[F, Map[K, (V, Long)]]): F[Unit] = {
      val process = C.now.flatMap { ts =>
        state.update(_.filter { case (_, (_, exp)) =>
          exp + expiresIn.toMillis > ts.toEpochMilli
        })
      }

      C.sleep(checkOnEvery) >> process >> checkExpirations(state)
    }

    Ref
      .of[F, Map[K, (V, Long)]](Map.empty[K, (V, Long)])
      .flatTap(s => checkExpirations(s).start.void)
      .map(s => RefbasedCache[F, K, V](s))
  }
