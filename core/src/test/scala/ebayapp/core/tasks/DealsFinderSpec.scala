package ebayapp.core.tasks

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.domain.search.BuyPrice
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}

class DealsFinderSpec extends CatsSpec {

  "A DealsFinder" should {

    "send notification on deals" in {
      val game     = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(1, BigDecimal(5)))
      val services = servicesMock

      when(services.deals.head.newDeals).thenReturn(fs2.Stream.emit(game))
      when(services.notification.cheapItem(any[ResellableItem])).thenReturn(IO.unit)

      val result = for {
        task <- DealsFinder.make(services)
        _    <- task.run.compile.drain
      } yield ()

      result.asserting { r =>
        verify(services.deals.head).newDeals
        verify(services.notification).cheapItem(game)
        r mustBe ()
      }
    }
  }
}
