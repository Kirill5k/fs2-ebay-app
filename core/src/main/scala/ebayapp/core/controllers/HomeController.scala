package ebayapp.core.controllers

import cats.Monad
import cats.effect.Sync
import ebayapp.kernel.controllers.Controller
import org.http4s.dsl.Http4sDsl
import org.http4s.{HttpRoutes, StaticFile}

private[controllers] class HomeController[F[_]: Sync] extends Controller[F] with Http4sDsl[F] {

  private val expectedFiles = List(".txt", ".ico", ".svg", ".png", ".json", ".js", ".css", ".map", ".html", ".webm")

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case req @ GET -> Root =>
        StaticFile.fromResource("static/index.html", Some(req)).getOrElseF(NotFound())
      case req @ GET -> path if expectedFiles.exists(path.segments.last.toString.endsWith) =>
        StaticFile.fromResource(s"static/${path.segments.mkString("/")}", Some(req)).getOrElseF(NotFound())
    }
}

object HomeController:
  def make[F[_]: Sync]: F[Controller[F]] =
    Monad[F].pure(new HomeController[F])
