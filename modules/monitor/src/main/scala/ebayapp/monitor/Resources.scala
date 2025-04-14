package ebayapp.monitor

import cats.effect.{Async, Resource}
import cats.syntax.apply.*
import cats.syntax.flatMap.*
import ebayapp.kernel.config.MongoConfig
import ebayapp.monitor.common.config.{AppConfig, EmailConfig}
import mongo4cats.client.MongoClient
import mongo4cats.database.MongoDatabase
import sttp.capabilities.fs2.Fs2Streams
import sttp.client3.httpclient.fs2.HttpClientFs2Backend
import sttp.client3.{SttpBackend, SttpBackendOptions}
import sttp.client4.{BackendOptions, WebSocketStreamBackend}
import sttp.client4.httpclient.fs2.HttpClientFs2Backend as Fs2Backend
import courier.{Envelope, Mailer as CourierMailer}

import scala.concurrent.duration.*

final class Mailer[F[_]](
    val from: String,
    private val mailer: CourierMailer
)(using
    F: Async[F]
) {
  def send(envelop: Envelope): F[Unit] =
    F.executionContext.flatMap(ec => F.fromFuture(F.delay(mailer(envelop)(ec))))
}

trait Resources[F[_]]:
  def clientBackend: SttpBackend[F, Any]
  def fs2Backed: WebSocketStreamBackend[F, Fs2Streams[F]]
  def database: MongoDatabase[F]
  def mailer: Mailer[F]

object Resources:
  private def mkFs2Backend[F[_]: Async]: Resource[F, WebSocketStreamBackend[F, Fs2Streams[F]]] =
    Fs2Backend.resource[F](options = BackendOptions(3.minutes, None))

  private def mkMailer[F[_]: Async](config: EmailConfig): Resource[F, Mailer[F]] =
    val mailer = CourierMailer(config.smtpHost, config.smtpPort).auth(true).as(config.username, config.password).startTls(true)()
    Resource.pure(Mailer[F](config.username, mailer))

  private def mkHttpClientBackend[F[_]: Async]: Resource[F, SttpBackend[F, Any]] =
    HttpClientFs2Backend.resource[F](SttpBackendOptions(connectionTimeout = 3.minutes, proxy = None))

  private def mkMongoDatabase[F[_]: Async](config: MongoConfig): Resource[F, MongoDatabase[F]] =
    MongoClient.fromConnectionString[F](config.connectionUri).evalMap(_.getDatabase(config.dbName))

  def make[F[_]: Async](config: AppConfig): Resource[F, Resources[F]] =
    (
      mkHttpClientBackend[F],
      mkFs2Backend[F],
      mkMongoDatabase[F](config.mongo),
      mkMailer(config.email)
    ).mapN { (httpSttp3, fs2Sttp4, mongo, mail) =>
      new Resources[F]:
        def clientBackend: SttpBackend[F, Any]                  = httpSttp3
        def fs2Backed: WebSocketStreamBackend[F, Fs2Streams[F]] = fs2Sttp4
        def database: MongoDatabase[F]                          = mongo
        def mailer: Mailer[F]                                   = mail
    }
