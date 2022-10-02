package ebayapp.monitor

import cats.effect.{Async, Resource}
import cats.syntax.apply.*
import ebayapp.kernel.config.MongoConfig
import ebayapp.monitor.common.config.{AppConfig, EmailConfig}
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import sttp.client3.SttpBackendOptions.Proxy
import sttp.client3.asynchttpclient.cats.AsyncHttpClientCatsBackend
import sttp.client3.{SttpBackend, SttpBackendOptions}
import courier.{Envelope, Mailer as CourierMailer}

import scala.concurrent.ExecutionContext
import scala.concurrent.duration.*

final class Mailer[F[_]](
    val from: String,
    private val mailer: CourierMailer,
    private val ec: ExecutionContext
)(using
    F: Async[F]
) {
  def send(envelop: Envelope): F[Unit] = F.fromFuture(F.delay(mailer(envelop)(ec)))
}

trait Resources[F[_]]:
  def clientBackend: SttpBackend[F, Any]
  def database: MongoDatabase[F]
  def mailer: Mailer[F]

object Resources:
  private def mkMailer[F[_]: Async](config: EmailConfig, ec: ExecutionContext): Resource[F, Mailer[F]] =
    val mailer = CourierMailer(config.smtpHost, config.smtpPort).auth(true).as(config.username, config.password).startTls(true)()
    Resource.pure(Mailer[F](config.username, mailer, ec))

  private def mkHttpClientBackend[F[_]: Async]: Resource[F, SttpBackend[F, Any]] =
    Resource.make(AsyncHttpClientCatsBackend[F](SttpBackendOptions(connectionTimeout = 3.minutes, proxy = None)))(_.close())

  private def mkMongoDatabase[F[_]: Async](config: MongoConfig): Resource[F, MongoDatabase[F]] =
    MongoClient.fromConnectionString[F](config.connectionUri).evalMap(_.getDatabase(config.dbName))

  def make[F[_]: Async](config: AppConfig, ec: ExecutionContext): Resource[F, Resources[F]] =
    (
      mkHttpClientBackend[F],
      mkMongoDatabase[F](config.mongo),
      mkMailer(config.email, ec)
    ).mapN { (http, mongo, mail) =>
      new Resources[F]:
        def clientBackend: SttpBackend[F, Any] = http
        def database: MongoDatabase[F]         = mongo
        def mailer: Mailer[F]                  = mail
    }
