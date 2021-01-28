package ebayapp.tasks

import cats.effect.Sync
import ebayapp.common.Logger
import ebayapp.services.{NotificationService, Services}
import fs2.Stream

final class ErrorsNotifier[F[_]: Sync: Logger](
    private val notificationService: NotificationService[F]
) {

  def alertOnErrors(): Stream[F, Unit] =
    Logger[F].errors.evalMap(notificationService.alert)
}

object ErrorsNotifier {

  def make[F[_]: Sync: Logger](services: Services[F]): F[ErrorsNotifier[F]] =
    Sync[F].delay(new ErrorsNotifier[F](services.notification))
}

