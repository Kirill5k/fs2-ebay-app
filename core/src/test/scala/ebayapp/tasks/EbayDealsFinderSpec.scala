package ebayapp.tasks

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.common.config.{EbayDealsConfig, SearchQuery}
import ebayapp.domain.ItemDetails
import ebayapp.domain.ItemDetails.Game
import ebayapp.services._

import scala.concurrent.duration._

class EbayDealsFinderSpec extends CatsSpec {

  val searchQueries = List(SearchQuery("q1"), SearchQuery("q1"))
  val dealConfig    = EbayDealsConfig(3.seconds, searchQueries, 20.minutes, 34)

  implicit val mapper: EbayItemMapper[Game]   = EbayItemMapper.gameDetailsMapper
  implicit val params: EbaySearchParams[Game] = EbaySearchParams.videoGameSearchParams

  "A VideoGamesEbayDealsFinder" should {

    "retry forever periodically" in {
      val services = mocks
      when(
        services.ebayDeals
          .find(any[SearchQuery], any[FiniteDuration])(any[EbayItemMapper[ItemDetails.Game]], any[EbaySearchParams[ItemDetails.Game]])
      ).thenReturn(fs2.Stream.empty)

      val result = for {
        task  <- EbayDealsFinder.videoGames(dealConfig, services)
        fiber <- task.searchForCheapItems().compile.drain.start
        _     <- IO.sleep(10.seconds)
        _     <- fiber.cancel
      } yield ()

      result.unsafeToFuture().map { r =>
        verify(services.ebayDeals, times(6)).find(any[SearchQuery], eqTo(20.minutes))(eqTo(mapper), eqTo(params))
        r must be(())
      }
    }
  }

  def mocks: Services[IO] = Services[IO](
    mock[NotificationService[IO]],
    mock[ResellableItemService[IO, ItemDetails.Game]],
    mock[EbayDealsService[IO]],
    mock[CexStockService[IO, ItemDetails.Generic]]
  )
}
