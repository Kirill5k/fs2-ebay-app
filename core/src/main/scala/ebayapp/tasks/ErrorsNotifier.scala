package ebayapp.tasks

import cats.effect.{Concurrent, Sync, Timer}
import ebayapp.common.Logger
import ebayapp.common.stream._
import ebayapp.services.{NotificationService, Services}
import fs2.Stream

import scala.concurrent.duration._

final class ErrorsNotifier[F[_]: Concurrent: Logger: Timer](
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

