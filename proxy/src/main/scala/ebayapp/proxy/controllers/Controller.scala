package ebayapp.proxy.controllers

import cats.Monad
import cats.effect.Deferred
import cats.effect.kernel.Concurrent
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.applicative.*
import org.http4s.client.Client
import org.http4s.dsl.Http4sDsl
import org.http4s.*
import org.typelevel.ci.CIString

trait Controller[F[_]] extends Http4sDsl[F]:
  def routes: HttpRoutes[F]


final case class RedirectController[F[_]: Concurrent](
    private val client: Client[F],
    private val sigTerm: Deferred[F, Unit]
) extends Controller[F] {

  private val HostHeader         = CIString("host")
  private val XRerouteToHeader   = CIString("X-Reroute-To")
  private val XReloadOn403Header = CIString("X-Reload-On-403")

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] { case req @ GET -> _ =>
      req.headers.get(XRerouteToHeader) match {
        case Some(redirectToUri) =>
          client
            .toHttpApp {
              req
                .withUri(Uri.unsafeFromString(redirectToUri.head.value + req.uri.toString()))
                .removeHeader(HostHeader)
                .removeHeader(XReloadOn403Header)
                .removeHeader(XRerouteToHeader)
            }
            .flatTap(res => terminateIfTrue(res.status == Status.Forbidden && req.headers.get(XReloadOn403Header).isDefined))
        case None =>
          BadRequest(s"missing $XRerouteToHeader header")
      }
    }

  private def terminateIfTrue(cond: Boolean): F[Unit] =
    if (cond) sigTerm.complete(()).void else ().pure[F]
}

final private class HealthController[F[_]: Concurrent] extends Controller[F]:
  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] { case GET -> Root / "health" / "status" => Ok("""{"status": true}""") }


object Controller {
  def redirect[F[_]: Concurrent](
      client: Client[F],
      sigTerm: Deferred[F, Unit]
  ): F[Controller[F]] =
    Monad[F].pure(new RedirectController[F](client, sigTerm))

  def health[F[_]: Concurrent]: F[Controller[F]] =
    Monad[F].pure(new HealthController[F])
}
