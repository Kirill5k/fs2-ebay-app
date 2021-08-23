package ebayapp.core.tasks

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.clients.SearchCriteria
import ebayapp.core.common.config.{DealsFinderConfig, DealsFinderRequest}
import ebayapp.core.domain.search.BuyPrice
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}

import scala.concurrent.duration._

class DealsFinderSpec extends CatsSpec {

  val requests = List(
    DealsFinderRequest(SearchCriteria("q1"), 34, Some(10)),
    DealsFinderRequest(SearchCriteria("q2"), 34, Some(10))
  )
  val dealConfig = DealsFinderConfig(2.seconds, requests)

  "A DealsFinder" should {

    "send notification on deals" in {
      val game     = ResellableItemBuilder.videoGame("Super Mario 3", buyPrice = BuyPrice(1, BigDecimal(5)))
      val services = servicesMock

      when(services.ebayDeals.newDeals(any[DealsFinderConfig])).thenReturn(fs2.Stream.emit(game))
      when(services.notification.cheapItem(any[ResellableItem])).thenReturn(IO.unit)

      val result = for {
        task <- DealsFinder.make(dealConfig, services)
        _    <- task.run().compile.drain
      } yield ()

      result.unsafeToFuture().map { r =>
        verify(services.ebayDeals).newDeals(dealConfig)
        verify(services.notification).cheapItem(game)
        r mustBe ()
      }
    }
  }
}
