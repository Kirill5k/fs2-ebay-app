package io.github.kirill5k.ebayapp

import cats.effect.{Blocker, Concurrent, ContextShift, Resource}
import cats.implicits._
import io.github.kirill5k.ebayapp.common.config.{AppConfig, MongoConfig}
import mongo4cats.client.MongoClientF
import sttp.client.asynchttpclient.cats.AsyncHttpClientCatsBackend
import sttp.client.{NothingT, SttpBackend}

final case class Resources[F[_]](
    httpClientBackend: SttpBackend[F, Nothing, NothingT],
    mongoClient: MongoClientF[F]
)

object Resources {

  private def mongoClient[F[_]: Concurrent](config: MongoConfig): Resource[F, MongoClientF[F]] =
    MongoClientF.fromConnectionString[F](config.connectionUri)

  private def httpClientBackend[F[_]: Concurrent: ContextShift]: Resource[F, SttpBackend[F, Nothing, NothingT]] =
    Resource.make(AsyncHttpClientCatsBackend[F]())(_.close())

  def make[F[_]: Concurrent: ContextShift](config: AppConfig): Resource[F, Resources[F]] =
    (httpClientBackend[F], mongoClient[F](config.mongo)).mapN(Resources.apply[F])
}
