package ebayapp.monitor

import cats.effect.{Async, Resource}
import cats.syntax.apply.*
import ebayapp.kernel.config.MongoConfig
import ebayapp.monitor.common.config.AppConfig
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import sttp.client3.SttpBackendOptions.Proxy
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend
import sttp.client3.{SttpBackend, SttpBackendOptions}

import scala.concurrent.duration.*

trait Resources[F[_]]:
  def clientBackend: SttpBackend[F, Any]
  def database: MongoDatabase[F]

object Resources:
  private def mkHttpClientBackend[F[_]: Async]: Resource[F, SttpBackend[F, Any]] =
    Resource.make(AsyncHttpClientCatsBackend[F](SttpBackendOptions(connectionTimeout = 3.minutes, proxy = None)))(_.close())

  private def mkMongoDatabase[F[_]: Async](config: MongoConfig): Resource[F, MongoDatabase[F]] =
    MongoClient.fromConnectionString[F](config.connectionUri).evalMap(_.getDatabase(config.dbName))

  def make[F[_]: Async](config: AppConfig): Resource[F, Resources[F]] =
    (
      mkHttpClientBackend[F],
      mkMongoDatabase[F](config.mongo)
    ).mapN { (http, mongo) =>
      new Resources[F] {
        def clientBackend: SttpBackend[F, Any] = http
        def database: MongoDatabase[F]         = mongo
      }
    }
