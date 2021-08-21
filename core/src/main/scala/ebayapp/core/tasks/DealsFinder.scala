package ebayapp.core.tasks

import cats.Monad
import ebayapp.core.common.config.DealsFinderConfig
import ebayapp.core.services.{DealsService, NotificationService, Services}
import fs2.Stream

final class DealsFinder[F[_]: Monad](
    private val dealsConfig: DealsFinderConfig,
    private val ebayDealsService: DealsService[F],
    private val notificationService: NotificationService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    ebayDealsService
      .newDeals(dealsConfig)
      .evalTap(notificationService.cheapItem)
      .drain
}

object DealsFinder {

  def make[F[_]: Monad](
      config: DealsFinderConfig,
      services: Services[F]
  ): F[Task[F]] =
    Monad[F].pure {
      new DealsFinder[F](
        config,
        services.ebayDeals,
        services.notification
      )
    }
}
