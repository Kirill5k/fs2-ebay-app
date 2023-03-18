package ebayapp.kernel.controllers

import cats.effect.{Async, Ref, Temporal}
import cats.syntax.functor.*
import cats.syntax.flatMap.*
import cats.syntax.apply.*
import cats.syntax.either.*
import ebayapp.kernel.controllers.HealthController.{AppStatus, Metadata}
import org.http4s.{HttpRoutes, Request}
import sttp.capabilities.fs2.Fs2Streams
import sttp.tapir.*
import sttp.tapir.server.ServerEndpoint
import sttp.tapir.server.http4s.Http4sServerInterpreter
import io.circe.Codec
import sttp.tapir.generic.auto.SchemaDerivation
import sttp.tapir.json.circe.TapirJsonCirce
import sttp.tapir.model.ServerRequest

import java.net.InetAddress
import java.time.Instant

final private[controllers] class HealthController[F[_]: Async](
    private val startupTime: Instant,
    private val appVersion: Option[String]
) extends Controller[F] {

  private val statusEndpoint: ServerEndpoint[Fs2Streams[F], F] =
    HealthController.statusEndpoint
      .serverLogicPure { req =>
        AppStatus(
          startupTime,
          appVersion,
          InetAddress.getLocalHost.getHostAddress,
          req.metadata
        ).asRight
      }

  override def routes: HttpRoutes[F] = Http4sServerInterpreter[F]().toRoutes(statusEndpoint)

  extension (sr: ServerRequest)
    private def metadata: Metadata = {
      val request = sr.underlying.asInstanceOf[Request[F]]
      Metadata(
        request.uri.renderString,
        request.headers.headers.map(h => (h.name.toString, h.value)).toMap,
        request.server.map(_.host.toString)
      )
    }
}

object HealthController extends TapirJsonCirce with SchemaDerivation {

  final case class Metadata(
      uri: String,
      headers: Map[String, String],
      serverAddress: Option[String]
  ) derives Codec.AsObject

  final case class AppStatus(
      startupTime: Instant,
      appVersion: Option[String],
      serverIpAddress: String,
      requestMetadata: Metadata
  ) derives Codec.AsObject

  val statusEndpoint = infallibleEndpoint.get
    .in("health" / "status")
    .in(extractFromRequest(identity))
    .out(jsonBody[AppStatus])

  def make[F[_]](using F: Async[F]): F[Controller[F]] =
    (F.realTimeInstant, F.delay(sys.env.get("VERSION")))
      .mapN((time, version) => new HealthController[F](time, version))
}
