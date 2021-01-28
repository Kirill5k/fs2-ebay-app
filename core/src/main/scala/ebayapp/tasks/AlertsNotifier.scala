package ebayapp.tasks

import cats.effect.Sync
import ebayapp.common.Logger
import ebayapp.services.{NotificationService, Services}
import fs2.Stream

final class AlertsNotifier[F[_]: Sync: Logger](
    private val notificationService: NotificationService[F]
) {

  def notifyOnErrors(): Stream[F, Unit] =
    Logger[F].errors.evalMap(notificationService.alert)
}

object AlertsNotifier {

  def make[F[_]: Sync: Logger](services: Services[F]): F[AlertsNotifier[F]] =
    Sync[F].delay(new AlertsNotifier[F](services.notification))
}

