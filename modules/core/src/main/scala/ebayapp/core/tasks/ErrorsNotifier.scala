package ebayapp.core.tasks

import cats.Monad
import cats.effect.Temporal
import ebayapp.core.common.Logger
import ebayapp.kernel.syntax.stream.*
import ebayapp.core.services.{NotificationService, Services}
import fs2.Stream

import scala.concurrent.duration.*

final class ErrorsNotifier[F[_]: Logger: Temporal](
    private val notificationService: NotificationService[F]
) extends Task[F]:
  def run: Stream[F, Unit] =
    Logger[F].errors
      .throttle(30.seconds)
      .evalMap(notificationService.alert)

object ErrorsNotifier {

  def make[F[_]: Temporal: Logger](services: Services[F]): F[Task[F]] =
    Monad[F].pure(ErrorsNotifier[F](services.notification))
}
