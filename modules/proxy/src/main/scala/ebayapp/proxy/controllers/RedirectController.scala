package ebayapp.proxy.controllers

import cats.Monad
import cats.effect.Concurrent
import cats.syntax.flatMap.*
import ebayapp.kernel.controllers.Controller
import ebayapp.proxy.common.{Interrupter, Resources}
import org.http4s.client.Client
import org.http4s.dsl.Http4sDsl
import org.http4s.*
import org.typelevel.ci.CIString
import org.typelevel.log4cats.Logger

final private class RedirectController[F[_]](
                                              private val standardClient: Client[F],
                                              private val interrupter: Interrupter[F]
                                            )(using
                                              F: Concurrent[F],
                                              logger: Logger[F]
                                            ) extends Controller[F] with Http4sDsl[F] {

  private val XRerouteToHeader      = CIString("X-Reroute-To")
  private val XReloadOn403Header    = CIString("X-Reload-On-403")
  private val XAcceptEncodingHeader = CIString("X-Accept-Encoding")

  private val AcceptEncodingHeader = CIString("accept-encoding")

  private val invalidHeaderRegex = "^((x-reroute|x-reload)-.*|host)$"

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case DELETE -> Root  => terminateIfTrue(true) >> Forbidden("Retry")
      case req @ GET -> _  => redirect(req)
      case req @ POST -> _ => redirect(req)
    }

  private def redirect(req: Request[F]): F[Response[F]] =
    req.redirectUri match
      case Right(url) =>
        val updReq = req.withUri(url).withSanitisedHeaders
        standardClient
          .toHttpApp(updReq)
          .flatTap { res =>
            logger.info(s"Request: ${updReq.method} ${updReq.uri} ${updReq.headers} Response: ${res.status}")
          }
          .flatTap(res => terminateIfTrue(res.status == Status.Forbidden && req.reloadOn403))
      case Left(errorMessage) =>
        BadRequest(errorMessage)

  private def terminateIfTrue(cond: Boolean): F[Unit] = F.whenA(cond)(interrupter.terminate)

  extension (req: Request[F])
    private def withSanitisedHeaders: Request[F] = {
      var newHeaders = Headers.empty
      req.headers.foreach { header =>
        if (!header.name.toString.toLowerCase.matches(invalidHeaderRegex)) {
          newHeaders = newHeaders.put(header)
        }
      }
      newHeaders = req.headers
        .get(XAcceptEncodingHeader)
        .map(hs => newHeaders.put(Header.Raw(AcceptEncodingHeader, hs.head.value)))
        .getOrElse(newHeaders)

      req.withHeaders(newHeaders)
    }

    private def reloadOn403: Boolean             = req.headers.get(XReloadOn403Header).isDefined
    private def redirectUri: Either[String, Uri] =
      req.headers
        .get(XRerouteToHeader)
        .toRight(s"Missing $XRerouteToHeader header")
        .flatMap { headerValue =>
          Uri.fromString(headerValue.head.value + req.uri.toString.replaceFirst("/proxy-pass", "")).left.map(_.message)
        }
}

object RedirectController:
  def make[F[_]: {Concurrent, Logger}](resources: Resources[F], interrupter: Interrupter[F]): F[Controller[F]] =
    Monad[F].pure(RedirectController[F](resources.emberClient, interrupter))
