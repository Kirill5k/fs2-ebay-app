package ebayapp.controllers

import cats.effect.Sync
import io.circe.generic.auto._
import org.http4s.HttpRoutes

final case class AppStatus(value: true)

private[controllers] class HealthController[F[_]: Sync] extends Controller[F] {

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case GET -> Root / "health" / "status" =>
        Ok(AppStatus(true))
    }
}
