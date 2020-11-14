package ebayapp.tasks

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.common.config.{EbayDealsConfig, SearchQuery}
import ebayapp.domain.{ItemDetails, ResellableItem, ResellableItemBuilder}
import ebayapp.domain.ItemDetails.Game
import ebayapp.domain.search.BuyPrice
import ebayapp.services._

import scala.concurrent.duration._

class EbayDealsFinderSpec extends CatsSpec {

  val searchQueries = List(SearchQuery("q1"), SearchQuery("q2"))
  val dealConfig    = EbayDealsConfig(2.seconds, searchQueries, 20.minutes, 34, 10)

  implicit val mapper: EbayItemMapper[Game]   = EbayItemMapper.gameDetailsMapper
  implicit val params: EbaySearchParams[Game] = EbaySearchParams.videoGameSearchParams

  "A VideoGamesEbayDealsFinder" should {

    "send notification for cheap items" in {
      val game     = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(1, BigDecimal(5)))
      val services = mocks
      when(services.ebayDeals.deals(eqTo(dealConfig))(eqTo(mapper), eqTo(params)))
        .thenReturn(fs2.Stream.evalSeq(IO.pure(List(game))))

      when(services.videoGame.save(any[ResellableItem.VideoGame])).thenReturn(IO.unit)
      when(services.videoGame.isNew(any[ResellableItem.VideoGame])).thenReturn(IO.pure(true))
      when(services.notification.cheapItem(any[ResellableItem.VideoGame])).thenReturn(IO.unit)

      val result = for {
        task <- EbayDealsFinder.videoGames(dealConfig, services)
        _    <- task.searchForCheapItems().compile.drain
      } yield ()

      result.unsafeToFuture().map { r =>
        verify(services.ebayDeals).deals(dealConfig)(mapper, params)
        verify(services.videoGame).isNew(game)
        verify(services.videoGame).save(game)
        verify(services.notification).cheapItem(game)
        r mustBe ()
      }
    }

    "ignore items with quantity gte 10" in {
      val game     = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(15, BigDecimal(5)))
      val services = mocks

      when(services.ebayDeals.deals(eqTo(dealConfig))(eqTo(mapper), eqTo(params)))
        .thenReturn(fs2.Stream.evalSeq(IO.pure(List(game))))

      when(services.videoGame.save(game)).thenReturn(IO.unit)
      when(services.videoGame.isNew(game)).thenReturn(IO.pure(true))

      val result = for {
        task <- EbayDealsFinder.videoGames(dealConfig, services)
        _    <- task.searchForCheapItems().compile.drain
      } yield ()

      result.unsafeToFuture().map { r =>
        verify(services.ebayDeals).deals(dealConfig)(mapper, params)
        verifyZeroInteractions(services.notification)
        r must be(())
      }
    }

  }

  def mocks: Services[IO] = Services[IO](
    mock[NotificationService[IO]],
    mock[ResellableItemService[IO, ItemDetails.Game]],
    mock[EbayDealsService[IO]],
    mock[CexStockService[IO]]
  )
}
