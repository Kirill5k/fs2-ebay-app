package ebayapp.core.common

import cats.effect.{Async, Resource}
import cats.implicits._
import ebayapp.core.common.config.{AppConfig, ClientConfig, MongoConfig}
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import sttp.client3.{SttpBackend, SttpBackendOptions}
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend

import scala.concurrent.duration._

trait Resources[F[_]] {
  def httpClientBackend: SttpBackend[F, Any]
  def database: MongoDatabase[F]
}

object Resources {

  private def mongoDatabase[F[_]: Async](config: MongoConfig): Resource[F, MongoDatabase[F]] =
    MongoClient.fromConnectionString[F](config.connectionUri).evalMap(_.getDatabase("ebay-app"))

  private def httpClientBackend[F[_]: Async](config: ClientConfig): Resource[F, SttpBackend[F, Any]] = {
    val proxy = (config.proxyHost, config.proxyPort).mapN { (host, port) =>
      SttpBackendOptions.Proxy(host, port, SttpBackendOptions.ProxyType.Http, onlyProxyHosts = config.onlyProxyHosts)
    }

    val backendConfig = SttpBackendOptions(connectionTimeout = 3.minutes, proxy = proxy)
    Resource.make(AsyncHttpClientCatsBackend[F](backendConfig))(_.close())
  }

  def make[F[_]: Async](config: AppConfig): Resource[F, Resources[F]] =
    (
      httpClientBackend[F](config.client),
      mongoDatabase[F](config.mongo)
    ).mapN { (http, mongo) =>
      new Resources[F] {
        def httpClientBackend: SttpBackend[F, Any] = http
        def database: MongoDatabase[F]             = mongo
      }
    }
}
