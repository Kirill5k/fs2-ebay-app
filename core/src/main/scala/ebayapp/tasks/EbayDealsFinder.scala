package ebayapp.tasks

import cats.effect.Sync
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.common.config.EbayDealsConfig
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.services.{EbayDealsService, NotificationService, ResellableItemService, Services}
import fs2.Stream

final class EbayDealsFinder[F[_]: Sync, D <: ItemDetails](
    private val dealsConfig: EbayDealsConfig,
    private val ebayDealsService: EbayDealsService[F],
    private val resellableItemService: ResellableItemService[F, D],
    private val notificationService: NotificationService[F]
)(
    implicit private val mapper: EbayItemMapper[D],
    implicit private val params: EbaySearchParams[D]
) {

  def searchForCheapItems(): Stream[F, Unit] =
    ebayDealsService
      .deals[D](dealsConfig)
      .evalFilter(resellableItemService.isNew)
      .evalTap(resellableItemService.save)
      .filter(isNotScam)
      .filter(isProfitableToResell)
      .evalTap(notificationService.cheapItem)
      .drain

  private val isNotScam: ResellableItem[D] => Boolean =
    item => item.buyPrice.quantityAvailable < dealsConfig.maxExpectedQuantity

  private val isProfitableToResell: ResellableItem[D] => Boolean =
    item => item.sellPrice.exists(rp => (rp.credit * 100 / item.buyPrice.rrp - 100) > dealsConfig.minMarginPercentage)
}

object EbayDealsFinder {

  def videoGames[F[_]: Sync](
      config: EbayDealsConfig,
      services: Services[F]
  ): F[EbayDealsFinder[F, ItemDetails.Game]] =
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
