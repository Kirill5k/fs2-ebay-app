package ebayapp.core.tasks

import cats.Monad
import ebayapp.core.common.config.EbayDealsConfig
import ebayapp.core.domain.{ResellableItem}
import ebayapp.core.services.{EbayDealsService, NotificationService, ResellableItemService, Services}
import fs2.Stream

final class EbayDealsFinder[F[_]: Monad](
    private val dealsConfig: EbayDealsConfig,
    private val ebayDealsService: EbayDealsService[F],
    private val resellableItemService: ResellableItemService[F],
    private val notificationService: NotificationService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    ebayDealsService
      .deals(dealsConfig)
      .evalFilter(resellableItemService.isNew)
      .evalTap(resellableItemService.save)
      .filter(hasRequiredStock)
      .filter(isProfitableToResell)
      .evalTap(notificationService.cheapItem)
      .drain

  private val hasRequiredStock: ResellableItem => Boolean =
    item => item.buyPrice.quantityAvailable > 0 && item.buyPrice.quantityAvailable < dealsConfig.maxExpectedQuantity

  private val isProfitableToResell: ResellableItem => Boolean =
    item => item.sellPrice.exists(rp => (rp.credit * 100 / item.buyPrice.rrp - 100) > dealsConfig.minMarginPercentage)
}

object EbayDealsFinder {

  def videoGames[F[_]: Monad](
      config: EbayDealsConfig,
      services: Services[F]
  ): F[Task[F]] =
    Monad[F].pure {
      new EbayDealsFinder[F](
        config,
        services.ebayDeals,
        services.resellableItem,
        services.notification
      )
    }
}
