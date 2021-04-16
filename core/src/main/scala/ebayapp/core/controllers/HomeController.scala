package ebayapp.core.controllers

import cats.effect.{Sync}
import org.http4s.{HttpRoutes, StaticFile}

private[controllers] class HomeController[F[_]: Sync] extends Controller[F] {

  private val expectedFiles = List(".txt", ".ico", ".svg", ".png", ".json", ".js", ".css", ".map", ".html", ".webm")

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case req @ GET -> Root =>
        StaticFile.fromResource("static/index.html", Some(req)).getOrElseF(NotFound())
      case req @ GET -> path if expectedFiles.exists(path.segments.last.toString.endsWith) =>
        StaticFile.fromResource(s"static/${path.segments.mkString("/")}", Some(req)).getOrElseF(NotFound())
    }

}
