package ebayapp.core.tasks

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.common.config.{EbayDealsConfig, SearchCriteria}
import ebayapp.core.domain.search.BuyPrice
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}

import scala.concurrent.duration._

class EbayDealsFinderSpec extends CatsSpec {

  val searchQueries = List(SearchCriteria("q1"), SearchCriteria("q2"))
  val dealConfig    = EbayDealsConfig(2.seconds, searchQueries, 34, 10)

  "A VideoGamesEbayDealsFinder" should {

    "send notification for cheap items" in {
      val game     = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(1, BigDecimal(5)))
      val services = servicesMock
      when(services.ebayDeals.deals(eqTo(dealConfig)))
        .thenReturn(fs2.Stream.evalSeq(IO.pure(List(game))))

      when(services.resellableItem.save(any[ResellableItem])).thenReturn(IO.unit)
      when(services.resellableItem.isNew(any[ResellableItem])).thenReturn(IO.pure(true))
      when(services.notification.cheapItem(any[ResellableItem])).thenReturn(IO.unit)

      val result = for {
        task <- EbayDealsFinder.videoGames(dealConfig, services)
        _    <- task.run().compile.drain
      } yield ()

      result.unsafeToFuture().map { r =>
        verify(services.ebayDeals).deals(dealConfig)
        verify(services.resellableItem).isNew(game)
        verify(services.resellableItem).save(game)
        verify(services.notification).cheapItem(game)
        r mustBe ()
      }
    }

    "ignore items with quantity gte 10" in {
      val game     = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(15, BigDecimal(5)))
      val services = servicesMock

      when(services.ebayDeals.deals(eqTo(dealConfig)))
        .thenReturn(fs2.Stream.evalSeq(IO.pure(List(game))))

      when(services.resellableItem.save(game)).thenReturn(IO.unit)
      when(services.resellableItem.isNew(game)).thenReturn(IO.pure(true))

      val result = for {
        task <- EbayDealsFinder.videoGames(dealConfig, services)
        _    <- task.run().compile.drain
      } yield ()

      result.unsafeToFuture().map { r =>
        verify(services.ebayDeals).deals(dealConfig)
        verifyZeroInteractions(services.notification)
        r mustBe ()
      }
    }

  }
}
