package ebayapp.tasks

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.common.config.{EbayDealsConfig, EbayDealsConfigs, SearchQuery}
import ebayapp.domain.ItemDetails
import ebayapp.services.{EbayDealsService, NotificationService, ResellableItemService}

import scala.concurrent.duration._

class EbayDealsFinderSpec extends CatsSpec {

  val searchQueries = List(SearchQuery("q1"), SearchQuery("q1"))
  val dealConfig    = EbayDealsConfigs(EbayDealsConfig(3.seconds, Nil, 20.minutes, 34))

  "A VideoGamesEbayDealsFinder" should {}


  def mocks: (EbayDealsService[IO], ResellableItemService[IO, ItemDetails.Game], NotificationService[IO]) = {
    val ebay         = mock[EbayDealsService[IO]]
    val item         = mock[ResellableItemService[IO, ItemDetails.Game]]
    val notification = mock[NotificationService[IO]]
    (ebay, item, notification)
  }
}
