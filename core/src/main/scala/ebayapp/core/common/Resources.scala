package ebayapp.core.common

import cats.effect.{Async, Resource}
import cats.syntax.option.*
import cats.syntax.apply.*
import com.mongodb.ConnectionString
import ebayapp.kernel.config.MongoConfig
import ebayapp.core.common.config.{AppConfig, ClientProxyConfig}
import mongo4cats.client.{MongoClient, MongoClientSettings}
import mongo4cats.database.MongoDatabase
import sttp.client3.SttpBackendOptions.Proxy
import sttp.client3.{SttpBackend, SttpBackendOptions}
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend

import java.util.concurrent.TimeUnit
import scala.concurrent.duration.*

trait Resources[F[_]] {
  def httpClientBackend: SttpBackend[F, Any]
  def proxyClientBackend: Option[SttpBackend[F, Any]]
  def database: MongoDatabase[F]

  def clientBackend(proxied: Option[Boolean]): SttpBackend[F, Any] =
    proxied match {
      case Some(true) => proxyClientBackend.getOrElse(throw new IllegalStateException("proxy is not setup"))
      case _          => httpClientBackend
    }
}

object Resources {

  private def mkHttpClientBackend[F[_]: Async](proxy: Option[Proxy]): Resource[F, SttpBackend[F, Any]] =
    Resource.make(AsyncHttpClientCatsBackend[F](SttpBackendOptions(connectionTimeout = 3.minutes, proxy = proxy)))(_.close())

  private def mkProxyClientBackend[F[_]: Async](config: ClientProxyConfig): Resource[F, Option[SttpBackend[F, Any]]] = {
    val proxy: Option[Proxy] = (config.host, config.port).mapN((h, p) => SttpBackendOptions.Proxy(h, p, SttpBackendOptions.ProxyType.Http))

    proxy
      .map(p => mkHttpClientBackend(p.some).map(_.some))
      .getOrElse(Resource.pure(None))
  }

  private def mkMongoDatabase[F[_]: Async](config: MongoConfig): Resource[F, MongoDatabase[F]] =
    val settings = MongoClientSettings.builder
      .applyConnectionString(new ConnectionString(config.connectionUri))
      .applyToSocketSettings { builder =>
        builder.connectTimeout(3, TimeUnit.MINUTES).readTimeout(3, TimeUnit.MINUTES)
      }
      .applyToClusterSettings { builder =>
        builder.serverSelectionTimeout(3, TimeUnit.MINUTES)
      }
      .build()
    MongoClient.create[F](settings).evalMap(_.getDatabase(config.dbName))

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
