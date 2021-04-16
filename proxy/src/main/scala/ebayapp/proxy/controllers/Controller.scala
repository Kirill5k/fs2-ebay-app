package ebayapp.proxy.controllers

import cats.effect.Sync
import cats.effect.concurrent.Deferred
import cats.implicits._
import ebayapp.proxy.config.RedirectionUrisConfig
import org.http4s.{HttpRoutes, Request, Response, Status, Uri}
import org.http4s.dsl.Http4sDsl
import org.http4s.client.Client
import org.http4s.headers.Host

trait Controller[F[_]] extends Http4sDsl[F] {

  def routes: HttpRoutes[F]
}

final case class RedirectController[F[_]: Sync](
    private val uris: RedirectionUrisConfig,
    private val client: Client[F],
    private val sigTerm: Deferred[F, Either[Throwable, Unit]]
) extends Controller[F] {
  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case req @ GET -> path if path.startsWith(Path("/cex")) =>
        proxyCall(req.withUri(Uri.unsafeFromString(uris.cex + req.uri.toString().substring(4))))
      case req @ GET -> path if path.startsWith(Path("/selfridges")) =>
        proxyCall(req.withUri(Uri.unsafeFromString(uris.selfridges + req.uri.toString().substring(11))))
      case req @ GET -> path if path.startsWith(Path("/jdsports")) =>
        proxyCall(req.withUri(Uri.unsafeFromString(uris.jdsports + req.uri.toString().substring(9))))
    }

  private def proxyCall(req: Request[F]): F[Response[F]] =
    client
      .stream(req.removeHeader(Host))
      .evalTap(res => if (res.status == Status.Forbidden) sigTerm.complete(Right(())) else ().pure[F])
      .compile
      .lastOrError
}

final private class HealthController[F[_]: Sync] extends Controller[F] {

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] { case GET -> Root / "health" / "status" =>
      Ok("""{"status": true}""")
    }
}

object Controller {
  def redirect[F[_]: Sync](
      uris: RedirectionUrisConfig,
      client: Client[F],
      sigTerm: Deferred[F, Either[Throwable, Unit]]
  ): F[Controller[F]] =
    Sync[F].pure(new RedirectController[F](uris, client, sigTerm))

  def health[F[_]: Sync]: F[Controller[F]] =
    Sync[F].pure(new HealthController[F])
}
