package ebayapp.tasks

import cats.effect.{Concurrent, Sync, Timer}
import ebayapp.common.Logger
import ebayapp.services.{NotificationService, Services}
import fs2.Stream

import scala.concurrent.duration._

final class ErrorsNotifier[F[_]: Concurrent: Logger: Timer](
    private val notificationService: NotificationService[F]
) {

  def alertOnErrors(): Stream[F, Unit] =
    Logger[F]
      .errors
      .debounce(3.seconds)
      .evalMap(notificationService.alert)
}

object ErrorsNotifier {

  def make[F[_]: Concurrent: Logger: Timer](services: Services[F]): F[ErrorsNotifier[F]] =
    Sync[F].delay(new ErrorsNotifier[F](services.notification))
}

