package ebayapp.core.controllers

import cats.effect.{Async, Ref}
import cats.syntax.functor.*
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

object Metadata {
  def from[F[_]](request: Request[F]): Metadata =
    Metadata(
      request.uri.renderString,
      request.headers.headers.map(h => (h.name.toString, h.value)).toMap,
      request.server.map(_.host.toString)
    )
}

final case class AppStatus(startupTime: Instant, requestMetadata: Metadata) derives Codec.AsObject

private[controllers] class HealthController[F[_]: Async](
    private val startupTime: Ref[F, Instant]
) extends Controller[F] {

  implicit val statusSchema: Schema[AppStatus] = Schema.string

  private val statusEndpoint: ServerEndpoint[Fs2Streams[F], F] =
    infallibleEndpoint.get
      .in(extractFromRequest(identity))
      .in("health" / "status")
      .out(jsonBody[AppStatus])
      .serverLogicSuccess(req => startupTime.get.map(t => AppStatus(t, Metadata.from[F](req.underlying.asInstanceOf[Request[F]]))))

  override def routes: HttpRoutes[F] = Http4sServerInterpreter[F]().toRoutes(statusEndpoint)

}
