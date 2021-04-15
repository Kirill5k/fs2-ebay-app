package ebayapp.core.tasks

import cats.effect.Sync
import ebayapp.core.clients.ebay.mappers.EbayItemMapper
import ebayapp.core.clients.ebay.mappers.EbayItemMapper.EbayItemMapper
import ebayapp.core.clients.ebay.search.EbaySearchParams
import ebayapp.core.common.config.EbayDealsConfig
import ebayapp.core.domain.{ItemDetails, ResellableItem}
import ebayapp.core.services.{EbayDealsService, NotificationService, ResellableItemService, Services}
import fs2.Stream

final class EbayDealsFinder[F[_]: Sync, D <: ItemDetails: EbayItemMapper: EbaySearchParams](
    private val dealsConfig: EbayDealsConfig,
    private val ebayDealsService: EbayDealsService[F],
    private val resellableItemService: ResellableItemService[F, D],
    private val notificationService: NotificationService[F]
) extends Task[F] {

  def run(): Stream[F, Unit] =
    ebayDealsService
      .deals[D](dealsConfig)
      .evalFilter(resellableItemService.isNew)
      .evalTap(resellableItemService.save)
      .filter(hasRequiredStock)
      .filter(isProfitableToResell)
      .evalTap(notificationService.cheapItem)
      .drain

  private val hasRequiredStock: ResellableItem[D] => Boolean =
    item => item.buyPrice.quantityAvailable > 0 && item.buyPrice.quantityAvailable < dealsConfig.maxExpectedQuantity

  private val isProfitableToResell: ResellableItem[D] => Boolean =
    item => item.sellPrice.exists(rp => (rp.credit * 100 / item.buyPrice.rrp - 100) > dealsConfig.minMarginPercentage)
}

object EbayDealsFinder {

  def videoGames[F[_]: Sync](
      config: EbayDealsConfig,
      services: Services[F]
  ): F[Task[F]] =
    Sync[F].delay {
      new EbayDealsFinder[F, ItemDetails.Game](
        config,
        services.ebayDeals,
        services.videoGame,
        services.notification
      )(
        Sync[F],
        EbayItemMapper.gameDetailsMapper,
        EbaySearchParams.videoGameSearchParams
      )
    }
}
