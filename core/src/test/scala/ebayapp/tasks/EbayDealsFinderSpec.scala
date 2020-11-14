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

  val searchQueries = List(SearchQuery("q1"), SearchQuery("q2"))
  val dealConfig    = EbayDealsConfig(2.seconds, searchQueries, 20.minutes, 34, 10)

  implicit val mapper: EbayItemMapper[Game]   = EbayItemMapper.gameDetailsMapper
  implicit val params: EbaySearchParams[Game] = EbaySearchParams.videoGameSearchParams

//  "A VideoGamesEbayDealsFinder" should {
//
//    "send notification for cheap items" in {
//      val game = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(1, BigDecimal(5)))
//      val services = mocks
//      when(services.ebayDeals.find(eqTo(SearchQuery("q1")), any[FiniteDuration])(eqTo(mapper), eqTo(params)))
//        .thenReturn(fs2.Stream.evalSeq(IO.pure(List(game))))
//      when(services.ebayDeals.find(eqTo(SearchQuery("q2")), any[FiniteDuration])(eqTo(mapper), eqTo(params)))
//        .thenReturn(fs2.Stream.empty)
//      when(services.videoGame.save(any[ResellableItem.VideoGame])).thenReturn(IO.unit)
//      when(services.videoGame.isNew(any[ResellableItem.VideoGame])).thenReturn(IO.pure(true))
//
//      val result = for {
//        task  <- EbayDealsFinder.videoGames(dealConfig, services)
//        fiber <- task.searchForCheapItems().compile.drain.start
//        _     <- IO.sleep(1.seconds)
//        _     <- fiber.cancel
//      } yield ()
//
//      result.unsafeToFuture().map { r =>
//        verify(services.ebayDeals).find(SearchQuery("q1"), 20.minutes)(mapper, params)
//        verify(services.ebayDeals).find(SearchQuery("q2"), 20.minutes)(mapper, params)
//        verify(services.videoGame).isNew(game)
//        verify(services.videoGame).save(game)
//        verify(services.notification).cheapItem(game)
//        r must be(())
//      }
//    }
//
//    "ignore items with quantity gte 10" in {
//      val game = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(15, BigDecimal(5)))
//      val services = mocks
//      when(services.ebayDeals.find(eqTo(SearchQuery("q1")), any[FiniteDuration])(eqTo(mapper), eqTo(params)))
//        .thenReturn(fs2.Stream.evalSeq(IO.pure(List(game))))
//      when(services.ebayDeals.find(eqTo(SearchQuery("q2")), any[FiniteDuration])(eqTo(mapper), eqTo(params)))
//        .thenReturn(fs2.Stream.empty)
//      when(services.videoGame.save(game)).thenReturn(IO.unit)
//      when(services.videoGame.isNew(game)).thenReturn(IO.pure(true))
//
//      val result = for {
//        task  <- EbayDealsFinder.videoGames(dealConfig, services)
//        fiber <- task.searchForCheapItems().compile.drain.start
//        _     <- IO.sleep(1.seconds)
//        _     <- fiber.cancel
//      } yield ()
//
//      result.unsafeToFuture().map { r =>
//        verify(services.ebayDeals).find(SearchQuery("q1"), 20.minutes)(mapper, params)
//        verify(services.ebayDeals).find(SearchQuery("q2"), 20.minutes)(mapper, params)
//        verifyZeroInteractions(services.notification)
//        r must be(())
//      }
//    }
//
//    "retry forever periodically" in {
//      val services = mocks
//      when(services.ebayDeals.find(any[SearchQuery], any[FiniteDuration])(eqTo(mapper), eqTo(params)))
//        .thenReturn(fs2.Stream.empty)
//
//      val result = for {
//        task  <- EbayDealsFinder.videoGames(dealConfig, services)
//        fiber <- task.searchForCheapItems().compile.drain.start
//        _     <- IO.sleep(5.seconds)
//        _     <- fiber.cancel
//      } yield ()
//
//      result.unsafeToFuture().map { r =>
//        verify(services.ebayDeals, times(3)).find(SearchQuery("q1"), 20.minutes)(mapper, params)
//        verify(services.ebayDeals, times(3)).find(SearchQuery("q2"), 20.minutes)(mapper, params)
//        r must be(())
//      }
//    }
//
//    "continue despite errors" in {
//      val services = mocks
//      when(services.ebayDeals.find(SearchQuery("q1"), 20.minutes)(mapper, params))
//        .thenReturn(fs2.Stream.raiseError[IO](new RuntimeException("uh-oh")))
//
//      val result = for {
//        task  <- EbayDealsFinder.videoGames(dealConfig, services)
//        fiber <- task.searchForCheapItems().compile.drain.start
//        _     <- IO.sleep(5.seconds)
//        _     <- fiber.cancel
//      } yield ()
//
//      result.unsafeToFuture().map { r =>
//        verify(services.ebayDeals, times(3)).find(SearchQuery("q1"), 20.minutes)(mapper, params)
//        verify(services.ebayDeals, never).find(SearchQuery("q2"), 20.minutes)(mapper, params)
//        r must be(())
//      }
//    }
//  }

  def mocks: Services[IO] = Services[IO](
    mock[NotificationService[IO]],
    mock[ResellableItemService[IO, ItemDetails.Game]],
    mock[EbayDealsService[IO]],
    mock[CexStockService[IO, ItemDetails.Generic]]
  )
}
