package ebayapp.core.tasks

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.clients.ebay.mappers.EbayItemMapper
import ebayapp.core.clients.ebay.mappers.EbayItemMapper.EbayItemMapper
import ebayapp.core.common.config.{EbayDealsConfig, SearchCriteria}
import ebayapp.core.domain.ItemDetails.Game
import ebayapp.core.domain.search.BuyPrice
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}

import scala.concurrent.duration._

class EbayDealsFinderSpec extends CatsSpec {

  val searchQueries = List(SearchCriteria("q1"), SearchCriteria("q2"))
  val dealConfig    = EbayDealsConfig(2.seconds, searchQueries, 34, 10)

  implicit val mapper: EbayItemMapper[Game]   = EbayItemMapper.gameDetailsMapper

  "A VideoGamesEbayDealsFinder" should {

    "send notification for cheap items" in {
      val game     = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(1, BigDecimal(5)))
      val services = servicesMock
      when(services.ebayDeals.deals(eqTo(dealConfig))(eqTo(mapper)))
        .thenReturn(fs2.Stream.evalSeq(IO.pure(List(game))))

      when(services.videoGame.save(any[ResellableItem.VideoGame])).thenReturn(IO.unit)
      when(services.videoGame.isNew(any[ResellableItem.VideoGame])).thenReturn(IO.pure(true))
      when(services.notification.cheapItem(any[ResellableItem.VideoGame])).thenReturn(IO.unit)

      val result = for {
        task <- EbayDealsFinder.videoGames(dealConfig, services)
        _    <- task.run().compile.drain
      } yield ()

      result.unsafeToFuture().map { r =>
        verify(services.ebayDeals).deals(dealConfig)(mapper)
        verify(services.videoGame).isNew(game)
        verify(services.videoGame).save(game)
        verify(services.notification).cheapItem(game)
        r mustBe ()
      }
    }

    "ignore items with quantity gte 10" in {
      val game     = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(15, BigDecimal(5)))
      val services = servicesMock

      when(services.ebayDeals.deals(eqTo(dealConfig))(eqTo(mapper)))
        .thenReturn(fs2.Stream.evalSeq(IO.pure(List(game))))

      when(services.videoGame.save(game)).thenReturn(IO.unit)
      when(services.videoGame.isNew(game)).thenReturn(IO.pure(true))

      val result = for {
        task <- EbayDealsFinder.videoGames(dealConfig, services)
        _    <- task.run().compile.drain
      } yield ()

      result.unsafeToFuture().map { r =>
        verify(services.ebayDeals).deals(dealConfig)(mapper)
        verifyZeroInteractions(services.notification)
        r mustBe ()
      }
    }

  }
}
