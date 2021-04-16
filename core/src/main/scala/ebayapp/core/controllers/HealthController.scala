package ebayapp.core.controllers

import cats.Monad
import io.circe.generic.auto._
import org.http4s.HttpRoutes

final case class AppStatus(value: true)

private[controllers] class HealthController[F[_]: Monad] extends Controller[F] {

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] {
      case GET -> Root / "health" / "status" =>
        Ok(AppStatus(true))
    }
}
