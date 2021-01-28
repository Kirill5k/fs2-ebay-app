package ebayapp.controllers

import cats.effect.{Blocker, ContextShift, Sync}
import ebayapp.common.LoggerF
import org.http4s.{HttpRoutes, StaticFile}

private[controllers] class HomeController[F[_]](blocker: Blocker) extends Controller[F] {

  private val expectedFiles = List(".txt", ".ico", ".svg", ".png", ".json", ".js", ".css", ".map", ".html", ".webm")

  override def routes(implicit cs: ContextShift[F], s: Sync[F], l: LoggerF[F]): HttpRoutes[F] =
    HttpRoutes.of[F] {
      case req @ GET -> Root =>
        StaticFile.fromResource("static/index.html", blocker, Some(req)).getOrElseF(NotFound())
      case req @ GET -> path if expectedFiles.exists(path.toList.last.endsWith) =>
        StaticFile.fromResource(s"static/${path.toList.mkString("/")}", blocker, Some(req)).getOrElseF(NotFound())
    }

}
