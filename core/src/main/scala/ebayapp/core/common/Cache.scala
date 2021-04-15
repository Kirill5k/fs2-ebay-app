package ebayapp.core.common

import java.time.Instant

import cats.effect.{Concurrent, Sync, Timer}
import cats.effect.concurrent.Ref
import cats.effect.implicits._
import cats.implicits._

import scala.concurrent.duration.FiniteDuration

trait Cache[F[_], K, V] {
  def get(key: K): F[Option[V]]
  def put(key: K, value: V): F[Unit]
  def contains(key: K): F[Boolean]
}

final private class RefbasedCache[F[_]: Sync, K, V](
    private val state: Ref[F, Map[K, (V, Instant)]]
) extends Cache[F, K, V] {

  override def get(key: K): F[Option[V]] =
    state.get.map(_.get(key).map(_._1))

  override def put(key: K, value: V): F[Unit] =
    state.update(s => s + (key -> (value -> Instant.now())))

  override def contains(key: K): F[Boolean] =
    state.get.map(_.contains(key))
}

object Cache {

  def make[F[_]: Concurrent: Timer, K, V](
      expiresIn: FiniteDuration,
      checkOnEvery: FiniteDuration
  ): F[Cache[F, K, V]] = {

    def checkExpirations(state: Ref[F, Map[K, (V, Instant)]]): F[Unit] = {
      val process = state.update(_.filter {
        case (_, (_, exp)) => exp.plusNanos(expiresIn.toNanos).isAfter(Instant.now)
      })

      Timer[F].sleep(checkOnEvery) >> process >> checkExpirations(state)
    }

    Ref.of[F, Map[K, (V, Instant)]](Map())
      .flatTap(s => checkExpirations(s).start.void)
      .map(s => new RefbasedCache[F, K, V](s))
  }
}
