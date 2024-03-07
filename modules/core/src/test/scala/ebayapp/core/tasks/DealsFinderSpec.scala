package ebayapp.core.tasks

import cats.effect.IO
import ebayapp.core.MockServices
import ebayapp.core.domain.ResellableItemBuilder.makeVideoGame
import ebayapp.core.domain.search.BuyPrice
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}
import kirill5k.common.cats.test.IOWordSpec

class DealsFinderSpec extends IOWordSpec {

  "A DealsFinder" should {

    "send notification on deals" in {
      val game     = makeVideoGame("Super Mario 3", buyPrice = BuyPrice(1, BigDecimal(5)))
      val services = MockServices.make

      when(services.deals.head.newDeals).thenStream(game)
      when(services.notification.cheapItem(any[ResellableItem])).thenReturnUnit

      val result = for
        task <- DealsFinder.make(services)
        _    <- task.run.compile.drain
      yield ()

      result.asserting { r =>
        verify(services.deals.head).newDeals
        verify(services.notification).cheapItem(game)
        r mustBe ()
      }
    }
  }
}
