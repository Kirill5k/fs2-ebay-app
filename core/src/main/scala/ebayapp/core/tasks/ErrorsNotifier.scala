package ebayapp.core.tasks

import cats.effect.{Concurrent, Sync, Timer}
import ebayapp.core.common.Logger
import ebayapp.core.common.stream._
import ebayapp.core.services.{NotificationService, Services}
import fs2.Stream

import scala.concurrent.duration._

final class ErrorsNotifier[F[_]: Logger: Timer](
    private val notificationService: NotificationService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    Logger[F]
      .errors
      .throttle(30.seconds)
      .evalMap(notificationService.alert)
}

object ErrorsNotifier {

  def make[F[_]: Concurrent: Logger: Timer](services: Services[F]): F[Task[F]] =
    Sync[F].delay(new ErrorsNotifier[F](services.notification))
}

