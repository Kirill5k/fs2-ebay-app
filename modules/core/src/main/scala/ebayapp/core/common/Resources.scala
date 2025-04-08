package ebayapp.core.common

import cats.effect.{Async, Resource}
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import ebayapp.kernel.config.MongoConfig
import ebayapp.core.common.config.AppConfig
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import mongo4cats.models.client.{ConnectionString, MongoClientSettings}
import sttp.client3.SttpBackendOptions.Proxy
import sttp.client3.{SttpBackend, SttpBackendOptions}
import sttp.client3.httpclient.fs2.HttpClientFs2Backend

import java.util.concurrent.TimeUnit
import scala.concurrent.duration.FiniteDuration

trait Resources[F[_]]:
  def httpClientBackend: SttpBackend[F, Any]
  def database: MongoDatabase[F]

object Resources {

  private def mkHttpClientBackend[F[_]: Async](timeout: FiniteDuration, proxy: Option[Proxy]): Resource[F, SttpBackend[F, Any]] =
    HttpClientFs2Backend.resource[F](SttpBackendOptions(connectionTimeout = timeout, proxy = proxy))

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
        mkHttpClientBackend[F](config.client.connectTimeout, None),
        mkMongoDatabase[F](config.mongo)
      ).mapN { (http, mongo) =>
        new Resources[F]:
          def httpClientBackend: SttpBackend[F, Any]          = http
          def database: MongoDatabase[F]                      = mongo
      }
}
