package ebayapp.core.common

import cats.effect.{Async, Resource}
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import ebayapp.kernel.config.MongoConfig
import ebayapp.core.common.config.AppConfig
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import mongo4cats.models.client.{ConnectionString, MongoClientSettings}
import sttp.capabilities.fs2.Fs2Streams
import sttp.client3.{SttpBackend, SttpBackendOptions}
import sttp.client3.httpclient.fs2.HttpClientFs2Backend
import sttp.client4.{BackendOptions, WebSocketStreamBackend}
import sttp.client4.httpclient.fs2.HttpClientFs2Backend as Fs2Backend

import java.util.concurrent.TimeUnit
import scala.concurrent.duration.FiniteDuration

trait Resources[F[_]]:
  def httpClientBackend: SttpBackend[F, Any]
  def fs2Backend: WebSocketStreamBackend[F, Fs2Streams[F]]
  def database: MongoDatabase[F]

object Resources {

  private def mkFs2Backend[F[_]: Async](timeout: FiniteDuration): Resource[F, WebSocketStreamBackend[F, Fs2Streams[F]]] =
    Fs2Backend.resource[F](options = BackendOptions(timeout, None))

  private def mkHttpClientBackend[F[_]: Async](timeout: FiniteDuration): Resource[F, SttpBackend[F, Any]] =
    HttpClientFs2Backend.resource[F](SttpBackendOptions(connectionTimeout = timeout, proxy = None))

  private def mkMongoDatabase[F[_]: Async](config: MongoConfig): Resource[F, MongoDatabase[F]] =
    val settings = MongoClientSettings
      .builder()
      .applyConnectionString(ConnectionString(config.connectionUri))
      .applyToSocketSettings { builder =>
        val _ = builder.connectTimeout(3, TimeUnit.MINUTES).readTimeout(3, TimeUnit.MINUTES)
      }
      .applyToClusterSettings { builder =>
        val _ = builder.serverSelectionTimeout(3, TimeUnit.MINUTES)
      }
      .build()
    MongoClient.create[F](settings).evalMap(_.getDatabase(config.dbName))

  def make[F[_]](config: AppConfig)(using F: Async[F]): Resource[F, Resources[F]] =
    Resource.eval(F.delay(System.setProperty("jdk.httpclient.allowRestrictedHeaders", "connection,content-length,expect,host,referer"))) >>
      (
        mkHttpClientBackend[F](config.client.connectTimeout),
        mkFs2Backend[F](config.client.connectTimeout),
        mkMongoDatabase[F](config.mongo)
      ).mapN { (sttp3Backend, sttp4Backend, mongo) =>
        new Resources[F]:
          def httpClientBackend: SttpBackend[F, Any]               = sttp3Backend
          def fs2Backend: WebSocketStreamBackend[F, Fs2Streams[F]] = sttp4Backend
          def database: MongoDatabase[F]                           = mongo
      }
}
