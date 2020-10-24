package ebayapp.tasks

import cats.effect.{Sync, Timer}
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.common.config.EbayDealsConfig
import ebayapp.domain.{ItemDetails, ResellableItem}
import ebayapp.services.{EbayDealsService, NotificationService, ResellableItemService, Services}
import fs2.Stream
import io.chrisdavenport.log4cats.Logger

abstract class EbayDealsFinder[F[_]: Sync: Logger: Timer, D <: ItemDetails] {

  protected def dealsConfig: EbayDealsConfig
  protected def ebayDealsService: EbayDealsService[F]
  protected def resellableItemService: ResellableItemService[F, D]
  protected def notificationService: NotificationService[F]

  implicit def mapper: EbayItemMapper[D]
  implicit def params: EbaySearchParams[D]

  def searchForCheapItems(): Stream[F, Unit] =
    (
      fs2.Stream
        .emits(dealsConfig.searchQueries)
        .flatMap(ebayDealsService.find[D](_, dealsConfig.maxListingDuration))
        .evalFilter(resellableItemService.isNew)
        .evalTap(resellableItemService.save)
        .filter(isProfitableToResell)
        .evalTap(notificationService.cheapItem)
        .handleErrorWith { error =>
          Stream.eval(Logger[F].error(error)(s"error getting deals from ebay")).drain
        }
        .drain ++ Stream.sleep(dealsConfig.searchFrequency)
    ).repeat

  private val isProfitableToResell: ResellableItem[D] => Boolean =
    item => item.sellPrice.exists(rp => (rp.credit * 100 / item.buyPrice.value - 100) > dealsConfig.minMarginPercentage)
}

object EbayDealsFinder {

  def videoGames[F[_]: Sync: Logger: Timer](
      config: EbayDealsConfig,
      services: Services[F]
  ): F[EbayDealsFinder[F, ItemDetails.Game]] =
    Sync[F].delay {
      new EbayDealsFinder[F, ItemDetails.Game] {
        override protected def dealsConfig: EbayDealsConfig                                      = config
        override protected def ebayDealsService: EbayDealsService[F]                             = services.ebayDeals
        override protected def resellableItemService: ResellableItemService[F, ItemDetails.Game] = services.videoGame
        override protected def notificationService: NotificationService[F]                       = services.notification
        implicit override def mapper: EbayItemMapper[ItemDetails.Game]                           = EbayItemMapper.gameDetailsMapper
        implicit override def params: EbaySearchParams[ItemDetails.Game]                         = EbaySearchParams.videoGameSearchParams
      }
    }
}
