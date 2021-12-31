package ebayapp.proxy.common

import cats.effect.Resource
import cats.effect.kernel.Async
import org.http4s.client.Client
import org.http4s.blaze.client.BlazeClientBuilder
import org.http4s.client.middleware.FollowRedirect

import scala.concurrent.duration.*

trait Resources[F[_]]:
  def blazeClient: Client[F]

object Resources:

  private def makeBlazeClient[F[_]: Async]: Resource[F, Client[F]] =
    BlazeClientBuilder[F]
      .withBufferSize(1024 * 200)
      .withMaxWaitQueueLimit(256 * 10)
      .withMaxTotalConnections(256 * 10)
      .withRequestTimeout(10.minutes)
      .withResponseHeaderTimeout(10.minutes)
      .resource

  def make[F[_]: Async]: Resource[F, Resources[F]] =
    makeBlazeClient[F].map { client =>
      new Resources[F] {
        def blazeClient: Client[F] = FollowRedirect(10)(client)
      }
    }
