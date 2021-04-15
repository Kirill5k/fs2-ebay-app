package ebayapp.proxy.common

import cats.effect.{Blocker, ConcurrentEffect, Resource}
import cats.implicits._
import org.http4s.client.Client
import org.http4s.client.blaze.BlazeClientBuilder

import scala.concurrent.ExecutionContext

trait Resources[F[_]] {
  def blocker: Blocker
  def blazeClient: Client[F]
}

object Resources {

  private def makeBlazeClient[F[_]: ConcurrentEffect]: Resource[F, Client[F]] =
    BlazeClientBuilder[F](ExecutionContext.global)
      .withBufferSize(1024 * 200)
      .withMaxWaitQueueLimit(256 * 10)
      .withMaxTotalConnections(256 * 10)
      .resource

  def make[F[_]: ConcurrentEffect]: Resource[F, Resources[F]] =
    (
      Blocker[F],
      makeBlazeClient[F]
    ).mapN { (bl, client) =>
      new Resources[F] {
        def blocker: Blocker       = bl
        def blazeClient: Client[F] = client
      }
    }
}
