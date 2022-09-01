package ebayapp.proxy.controllers

import cats.Monad
import cats.effect.Concurrent
import cats.syntax.flatMap.*
import cats.syntax.functor.*
import ebayapp.kernel.controllers.Controller
import ebayapp.proxy.common.{Interrupter, Resources}
import org.http4s.client.Client
import org.http4s.dsl.Http4sDsl
import org.http4s.*
import org.typelevel.ci.CIString

final private class RedirectController[F[_]](
    private val standardClient: Client[F],
    private val proxiedClient: Client[F],
    private val interrupter: Interrupter[F]
)(using
    F: Concurrent[F]
) extends Controller[F] with Http4sDsl[F] {

  private val HostHeader         = CIString("host")
  private val XRerouteToHeader   = CIString("X-Reroute-To")
  private val XReloadOn403Header = CIString("X-Reload-On-403")
  private val XProxiedHeader     = CIString("X-Proxied")

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case DELETE -> Root  => terminateIfTrue(true) >> Forbidden("Retry")
      case req @ GET -> _  => redirect(req)
      case req @ POST -> _ => redirect(req)
    }

  private def redirect(req: Request[F]): F[Response[F]] =
    req.redirectUri match {
      case Right(url) =>
        req.redirectClient
          .toHttpApp(req.withUri(url).removeHeaders(HostHeader, XReloadOn403Header, XRerouteToHeader, XProxiedHeader))
          .flatTap(res => terminateIfTrue(res.status == Status.Forbidden && req.reloadOn403))
      case Left(errorMessage) =>
        BadRequest(errorMessage)
    }

  private def terminateIfTrue(cond: Boolean): F[Unit] = F.whenA(cond)(interrupter.terminate)

  extension (req: Request[F])
    def removeHeaders(keys: CIString*): Request[F] = keys.foldLeft(req)(_.removeHeader(_))
    def reloadOn403: Boolean                       = req.headers.get(XReloadOn403Header).isDefined
    def redirectClient: Client[F]                  = req.headers.get(XProxiedHeader).as(proxiedClient).getOrElse(standardClient)
    def redirectUri: Either[String, Uri] =
      req.headers
        .get(XRerouteToHeader)
        .toRight(s"Missing $XRerouteToHeader header")
        .flatMap { headerValue =>
          Uri.fromString(headerValue.head.value + req.uri.toString.replaceFirst("/proxy-pass", "")).left.map(_.message)
        }
}

object RedirectController {
  def make[F[_]: Concurrent](resources: Resources[F], interrupter: Interrupter[F]): F[Controller[F]] =
    Monad[F].pure(RedirectController[F](resources.blazeClient, resources.jdkHttpClient, interrupter))
}
