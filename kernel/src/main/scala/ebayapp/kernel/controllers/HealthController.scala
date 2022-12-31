package ebayapp.kernel.controllers

import cats.effect.{Async, Ref, Temporal}
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import cats.syntax.apply.*
import org.http4s.{HttpRoutes, Request}
import sttp.capabilities.fs2.Fs2Streams
import sttp.tapir.*
import sttp.tapir.server.ServerEndpoint
import sttp.tapir.server.http4s.Http4sServerInterpreter
import io.circe.Codec

import java.time.Instant

final case class Metadata(
    uri: String,
    headers: Map[String, String],
    serverAddress: Option[String]
) derives Codec.AsObject

object Metadata:
  def from[F[_]](request: Request[F]): Metadata =
    Metadata(
      request.uri.renderString,
      request.headers.headers.map(h => (h.name.toString, h.value)).toMap,
      request.server.map(_.host.toString)
    )

final case class AppStatus(
    startupTime: Instant,
    appVersion: Option[String],
    requestMetadata: Metadata
) derives Codec.AsObject

private[controllers] class HealthController[F[_]: Async](
    private val startupTime: Instant,
    private val appVersion: Option[String]
) extends Controller[F] {

  given statusSchema: Schema[AppStatus] = Schema.string

  private val statusEndpoint: ServerEndpoint[Fs2Streams[F], F] =
    infallibleEndpoint.get
      .in(extractFromRequest(identity))
      .in("health" / "status")
      .out(jsonBody[AppStatus])
      .serverLogicPure { req =>
        Right(AppStatus(startupTime, appVersion, Metadata.from[F](req.underlying.asInstanceOf[Request[F]])))
      }

  override def routes: HttpRoutes[F] = Http4sServerInterpreter[F]().toRoutes(statusEndpoint)
}

object HealthController:
  def make[F[_]](using F: Async[F]): F[Controller[F]] =
    (F.realTimeInstant, F.delay(sys.env.get("VERSION")))
      .mapN((time, version) => new HealthController[F](time, version))
