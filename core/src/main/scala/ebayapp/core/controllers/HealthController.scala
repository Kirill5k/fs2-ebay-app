package ebayapp.core.controllers

import cats.effect.Async
import cats.syntax.either._
import io.circe.generic.auto._
import org.http4s.HttpRoutes
import sttp.capabilities.fs2.Fs2Streams
import sttp.tapir._
import sttp.tapir.model.ServerRequest
import sttp.tapir.server.ServerEndpoint
import sttp.tapir.server.http4s.Http4sServerInterpreter

final case class Metadata(uri: String, headers: Map[String, String])

final case class AppStatus(status: true, requestMetadata: Metadata)

object AppStatus {
  def up(metadata: Metadata): AppStatus = AppStatus(true, metadata)

  def up(request: ServerRequest): AppStatus =
    up {
      Metadata(
        request.uri.toString(),
        request.headers.map(h => (h.name, h.value)).toMap
      )
    }
}

private[controllers] class HealthController[F[_]: Async] extends Controller[F] {

  implicit val statusSchema: Schema[AppStatus] = Schema.string

  private val statusEndpoint: ServerEndpoint[Fs2Streams[F], F] =
    infallibleEndpoint.get
      .in(extractFromRequest(identity))
      .in("health" / "status")
      .out(jsonBody[AppStatus])
      .serverLogicPure(req => AppStatus.up(req).asRight[Nothing])

  override def routes: HttpRoutes[F] = Http4sServerInterpreter[F]().toRoutes(statusEndpoint)

}
