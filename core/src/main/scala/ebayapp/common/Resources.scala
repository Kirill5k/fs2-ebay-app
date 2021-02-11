package ebayapp.common

import cats.effect.{Blocker, Concurrent, ContextShift, Resource}
import cats.implicits._
import ebayapp.common.config.{AppConfig, MongoConfig}
import mongo4cats.client.MongoClientF
import sttp.client3.SttpBackend
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend

final case class Resources[F[_]](
    blocker: Blocker,
    httpClientBackend: SttpBackend[F, Any],
    mongoClient: MongoClientF[F]
)

object Resources {

  private def mongoClient[F[_]: Concurrent](config: MongoConfig): Resource[F, MongoClientF[F]] =
    MongoClientF.fromConnectionString[F](config.connectionUri)

  private def httpClientBackend[F[_]: Concurrent: ContextShift]: Resource[F, SttpBackend[F, Any]] =
    Resource.make(AsyncHttpClientCatsBackend[F]())(_.close())

  def make[F[_]: Concurrent: ContextShift](config: AppConfig): Resource[F, Resources[F]] =
    (Blocker[F], httpClientBackend[F], mongoClient[F](config.mongo)).mapN(Resources.apply[F])
}
