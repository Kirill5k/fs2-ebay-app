package ebayapp.core.common

import cats.effect.{Async, Resource}
import cats.syntax.option._
import cats.syntax.apply._
import ebayapp.core.common.config.{AppConfig, ClientProxyConfig, MongoConfig}
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import sttp.client3.SttpBackendOptions.Proxy
import sttp.client3.{SttpBackend, SttpBackendOptions}
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend

import scala.concurrent.duration._

trait Resources[F[_]] {
  def httpClientBackend: SttpBackend[F, Any]
  def proxyClientBackend: Option[SttpBackend[F, Any]]
  def database: MongoDatabase[F]

  def clientBackend(proxied: Boolean): SttpBackend[F, Any] =
    if (!proxied) httpClientBackend
    else proxyClientBackend.getOrElse(throw new IllegalStateException("proxy is not setup"))
}

object Resources {

  private def mkHttpClientBackend[F[_]: Async](proxy: Option[Proxy]): Resource[F, SttpBackend[F, Any]] =
    Resource.make(AsyncHttpClientCatsBackend[F](SttpBackendOptions(connectionTimeout = 3.minutes, proxy = proxy)))(_.close())

  private def mkProxyClientBackend[F[_]: Async](config: ClientProxyConfig): Resource[F, Option[SttpBackend[F, Any]]] =
    (config.host, config.port)
      .mapN((host, port) => SttpBackendOptions.Proxy(host, port, SttpBackendOptions.ProxyType.Http))
      .map(p => mkHttpClientBackend(p.some).map(_.some))
      .getOrElse(Resource.pure(None))

  private def mkMongoDatabase[F[_]: Async](config: MongoConfig): Resource[F, MongoDatabase[F]] =
    MongoClient.fromConnectionString[F](config.connectionUri).evalMap(_.getDatabase(config.dbName))

  def make[F[_]: Async](config: AppConfig): Resource[F, Resources[F]] =
    (
      mkHttpClientBackend[F](None),
      mkProxyClientBackend[F](config.clientProxy),
      mkMongoDatabase[F](config.mongo)
    ).mapN { (http, proxy, mongo) =>
      new Resources[F] {
        def httpClientBackend: SttpBackend[F, Any]          = http
        def proxyClientBackend: Option[SttpBackend[F, Any]] = proxy
        def database: MongoDatabase[F]                      = mongo
      }
    }
}
