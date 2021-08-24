package ebayapp.proxy.controllers

import cats.Monad
import cats.effect.Deferred
import cats.effect.kernel.Concurrent
import cats.syntax.flatMap._
import cats.syntax.functor._
import cats.syntax.applicative._
import ebayapp.proxy.common.config.RedirectionUrisConfig
import org.http4s.client.Client
import org.http4s.dsl.Http4sDsl
import org.http4s._
import org.typelevel.ci.CIString

trait Controller[F[_]] extends Http4sDsl[F] {
  def routes: HttpRoutes[F]
}

final case class RedirectController[F[_]: Concurrent](
    private val uris: RedirectionUrisConfig,
    private val client: Client[F],
    private val sigTerm: Deferred[F, Either[Throwable, Unit]]
) extends Controller[F] {

  private val XRerouteToHeader = CIString("X-Reroute-To")

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case req @ GET -> path if path.startsWithString("/cex") =>
        proxyCall(req.withUri(Uri.unsafeFromString(uris.cex + req.uri.toString().substring(4))))
      case req @ GET -> path if path.startsWithString("/selfridges") =>
        proxyCall(req.withUri(Uri.unsafeFromString(uris.selfridges + req.uri.toString().substring(11))))
      case req @ GET -> path if path.startsWithString("/jdsports") =>
        proxyCall(req.withUri(Uri.unsafeFromString(uris.jdsports + req.uri.toString().substring(9))))
      case req @ GET -> _ =>
        req.headers.get(XRerouteToHeader) match {
          case Some(value) => proxyCall(req.withUri(Uri.unsafeFromString(value.head.value + req.uri.toString())), reloadOn403 = false)
          case None        => BadRequest(s"missing $XRerouteToHeader header")
        }
    }

  private def proxyCall(req: Request[F], reloadOn403: Boolean = true): F[Response[F]] =
    client
      .toHttpApp
      .run(req.removeHeader(CIString("host")))
      .flatTap(res => if (reloadOn403 && res.status == Status.Forbidden) sigTerm.complete(Right(())).void else ().pure[F])
}

final private class HealthController[F[_]: Concurrent] extends Controller[F] {

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] { case GET -> Root / "health" / "status" =>
      Ok("""{"status": true}""")
    }
}

object Controller {
  def redirect[F[_]: Concurrent](
      uris: RedirectionUrisConfig,
      client: Client[F],
      sigTerm: Deferred[F, Either[Throwable, Unit]]
  ): F[Controller[F]] =
    Monad[F].pure(new RedirectController[F](uris, client, sigTerm))

  def health[F[_]: Concurrent]: F[Controller[F]] =
    Monad[F].pure(new HealthController[F])
}
