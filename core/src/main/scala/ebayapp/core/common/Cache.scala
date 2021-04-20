package ebayapp.core.common

import cats.Monad

import java.time.Instant
import cats.effect.{Ref, Temporal}
import cats.effect.implicits._
import cats.implicits._

import scala.concurrent.duration.FiniteDuration

trait Cache[F[_], K, V] {
  def get(key: K): F[Option[V]]
  def put(key: K, value: V): F[Unit]
  def contains(key: K): F[Boolean]
  def evalIfNew(key: K)(fa: => F[Unit]): F[Unit]
}

final private class RefbasedCache[F[_]: Monad, K, V](
    private val state: Ref[F, Map[K, (V, Instant)]]
) extends Cache[F, K, V] {

  override def get(key: K): F[Option[V]] =
    state.get.map(_.get(key).map(_._1))

  override def put(key: K, value: V): F[Unit] =
    state.update(s => s + (key -> (value -> Instant.now())))

  override def contains(key: K): F[Boolean] =
    state.get.map(_.contains(key))

  override def evalIfNew(key: K)(fa: => F[Unit]): F[Unit] =
    contains(key).flatMap(if (_) ().pure[F] else fa)
}

object Cache {

  def make[F[_]: Temporal, K, V](
      expiresIn: FiniteDuration,
      checkOnEvery: FiniteDuration
  ): F[Cache[F, K, V]] = {

    def checkExpirations(state: Ref[F, Map[K, (V, Instant)]]): F[Unit] = {
      val process = state.update(_.filter {
        case (_, (_, exp)) => exp.plusNanos(expiresIn.toNanos).isAfter(Instant.now)
      })

      Temporal[F].sleep(checkOnEvery) >> process >> checkExpirations(state)
    }

    Ref.of[F, Map[K, (V, Instant)]](Map())
      .flatTap(s => checkExpirations(s).start.void)
      .map(s => new RefbasedCache[F, K, V](s))
  }
}
