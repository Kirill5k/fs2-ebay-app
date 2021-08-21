package ebayapp.core.controllers

import cats.Monad
import io.circe.generic.auto._
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec._

final case class AppStatus(value: true)

object AppStatus {
  val Up = AppStatus(true)
}

private[controllers] class HealthController[F[_]: Monad] extends Controller[F] {

  override def routes: HttpRoutes[F] =
    HttpRoutes.of[F] { case GET -> Root / "health" / "status" => Ok(AppStatus.Up) }
}
