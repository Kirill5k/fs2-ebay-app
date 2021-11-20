package ebayapp.core.controllers

import cats.effect.{Async, Ref}
import cats.syntax.functor._
import io.circe.generic.auto._
import org.http4s.HttpRoutes
import sttp.capabilities.fs2.Fs2Streams
import sttp.tapir._
import sttp.tapir.model.ServerRequest
import sttp.tapir.server.ServerEndpoint
import sttp.tapir.server.http4s.Http4sServerInterpreter

import java.time.Instant

final case class Metadata(uri: String, headers: Map[String, String])

final case class AppStatus(status: true, startupTime: Instant, requestMetadata: Metadata)

object AppStatus {
  def up(startupTime: Instant, metadata: Metadata): AppStatus = AppStatus(true, startupTime, metadata)

  def up(startupTime: Instant, request: ServerRequest): AppStatus =
    up(startupTime, Metadata(request.uri.toString(),request.headers.map(h => (h.name, h.value)).toMap))
}

private[controllers] class HealthController[F[_]: Async](
    private val startupTime: Ref[F, Instant]
) extends Controller[F] {

  implicit val statusSchema: Schema[AppStatus] = Schema.string

  private val statusEndpoint: ServerEndpoint[Fs2Streams[F], F] =
    infallibleEndpoint.get
      .in(extractFromRequest(identity))
      .in("health" / "status")
      .out(jsonBody[AppStatus])
      .serverLogicSuccess(req => startupTime.get.map(t => AppStatus.up(t, req)))

  override def routes: HttpRoutes[F] = Http4sServerInterpreter[F]().toRoutes(statusEndpoint)

}
