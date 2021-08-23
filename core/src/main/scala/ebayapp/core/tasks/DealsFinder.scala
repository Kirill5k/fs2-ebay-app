package ebayapp.core.tasks

import cats.Monad
import ebayapp.core.services.{DealsService, NotificationService, Services}
import fs2.Stream

final class DealsFinder[F[_]](
    private val notificationService: NotificationService[F],
    private val ebayDealsService: DealsService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    ebayDealsService.newDeals.evalMap(notificationService.cheapItem)
}

object DealsFinder {

  def make[F[_]: Monad](services: Services[F]): F[Task[F]] =
    Monad[F].pure(new DealsFinder[F](services.notification, services.ebayDeals))
}
