package ebayapp.proxy.controllers

import cats.Monad
import cats.effect.Deferred
import cats.effect.kernel.Concurrent
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import cats.syntax.applicative.*
import ebayapp.kernel.controllers.Controller
import ebayapp.proxy.common.Interrupter
import org.http4s.client.middleware.FollowRedirect
import org.http4s.client.Client
import org.http4s.dsl.Http4sDsl
import org.http4s.*
import org.typelevel.ci.CIString

final case class RedirectController[F[_]: Concurrent](
    private val client: Client[F],
    private val interrupter: Interrupter[F]
) extends Controller[F] with Http4sDsl[F] {

  private val HostHeader         = CIString("host")
  private val XRerouteToHeader   = CIString("X-Reroute-To")
  private val XReloadOn403Header = CIString("X-Reload-On-403")

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case DELETE -> Root =>
        terminateIfTrue(true) >> Forbidden("Retry")
      case req @ GET -> _ =>
        req.headers.get(XRerouteToHeader) match {
          case Some(redirectToUri) =>
            client
              .toHttpApp {
                req
                  .withUri(Uri.unsafeFromString(redirectToUri.head.value + req.uri.toString))
                  .removeHeader(HostHeader)
                  .removeHeader(XReloadOn403Header)
                  .removeHeader(XRerouteToHeader)
              }
              .flatTap(res => terminateIfTrue(res.status == Status.Forbidden && req.headers.get(XReloadOn403Header).isDefined))
          case None =>
            BadRequest(s"Missing $XRerouteToHeader header")
        }
    }

  private def terminateIfTrue(cond: Boolean): F[Unit] =
    if (cond) interrupter.terminate else ().pure[F]
}

object RedirectController {
  def make[F[_]: Concurrent](client: Client[F], interrupter: Interrupter[F]): F[Controller[F]] =
    Monad[F].pure(new RedirectController[F](client, interrupter))
}
