package ebayapp.core.tasks

import cats.Monad
import cats.effect.kernel.Concurrent
import ebayapp.core.services.{DealsService, NotificationService, Services}
import fs2.Stream

final class DealsFinder[F[_]: Concurrent](
    private val notificationService: NotificationService[F],
    private val dealsServices: List[DealsService[F]]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    Stream.emits(dealsServices).map(_.newDeals).parJoinUnbounded.evalMap(notificationService.cheapItem)
}

object DealsFinder {

  def make[F[_]: Concurrent](services: Services[F]): F[Task[F]] =
    Monad[F].pure(new DealsFinder[F](services.notification, services.deals))
}
