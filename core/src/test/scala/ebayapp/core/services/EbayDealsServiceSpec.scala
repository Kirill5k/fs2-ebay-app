package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.ebay.EbayClient
import ebayapp.core.clients.ebay.mappers.EbayItemMapper
import ebayapp.core.clients.ebay.mappers.EbayItemMapper.EbayItemMapper
import ebayapp.core.clients.ebay.search.EbaySearchParams
import ebayapp.core.common.config.{EbayDealsConfig, SearchCriteria}
import ebayapp.core.domain.ItemDetails.Game
import ebayapp.core.domain.{ItemDetails, ResellableItem, ResellableItemBuilder}
import fs2.Stream

import scala.concurrent.duration._

class EbayDealsServiceSpec extends CatsSpec {

  val videoGame  = ResellableItemBuilder.videoGame("super mario 3")
  val videoGame2 = ResellableItemBuilder.videoGame("Battlefield 1", sellPrice = None)

  implicit val mapper: EbayItemMapper[Game]   = EbayItemMapper.gameDetailsMapper
  implicit val params: EbaySearchParams[Game] = EbaySearchParams.videoGameSearchParams

  "An EbayDealsSearchService" should {

    "search ebay for new deals continuously" in {
      val dealsConfig             = EbayDealsConfig(2.seconds, List(SearchCriteria("q1"), SearchCriteria("q2")), 5.minutes, 5, 10)
      val (ebayClient, cexClient) = mockDependecies

      when(ebayClient.latest[Game](eqTo(SearchCriteria("q1")), eqTo(5.minutes))(eqTo(mapper), eqTo(params)))
        .thenReturn(Stream.evalSeq(IO.pure(List(videoGame, videoGame2))))
        .andThen(Stream.empty)

      when(ebayClient.latest[Game](eqTo(SearchCriteria("q2")), eqTo(5.minutes))(eqTo(mapper), eqTo(params)))
        .thenReturn(Stream.empty)

      doReturn(IO.pure(videoGame))
        .doReturn(IO.pure(videoGame2))
        .when(cexClient)
        .withUpdatedSellPrice(any[ResellableItem[ItemDetails.Game]])

      val result = for {
        service <- EbayDealsService.make(ebayClient, cexClient)
        items   <- service.deals(dealsConfig).interruptAfter(5.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(ebayClient, times(2)).latest[Game](SearchCriteria("q1"), 5.minutes)
        verify(ebayClient, times(2)).latest[Game](SearchCriteria("q2"), 5.minutes)
        verify(cexClient, times(2)).withUpdatedSellPrice(any[ResellableItem[ItemDetails.Game]])
        items mustBe List(videoGame, videoGame2)
      }
    }

    "handle errors gracefully" in {
      val dealsConfig             = EbayDealsConfig(2.seconds, List(SearchCriteria("q1")), 5.minutes, 5, 10)
      val (ebayClient, cexClient) = mockDependecies

      when(ebayClient.latest[Game](any[SearchCriteria], any[FiniteDuration])(eqTo(mapper), eqTo(params)))
        .thenReturn(Stream.eval(IO.raiseError(new RuntimeException())))
        .andThen((Stream.evalSeq(IO.pure(List(videoGame)))))

      doAnswer((i: ResellableItem[ItemDetails.Game]) => IO.pure(i))
        .when(cexClient)
        .withUpdatedSellPrice(any[ResellableItem[ItemDetails.Game]])

      val result = for {
        service <- EbayDealsService.make(ebayClient, cexClient)
        items   <- service.deals(dealsConfig).interruptAfter(3.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(ebayClient, times(2)).latest[Game](SearchCriteria("q1"), 5.minutes)
        verify(cexClient).withUpdatedSellPrice(any[ResellableItem[ItemDetails.Game]])
        items mustBe List(videoGame)
      }
    }
  }

  def mockDependecies: (EbayClient[IO], CexClient[IO]) = {
    val ebayClient = mock[EbayClient[IO]]
    val cexClient  = mock[CexClient[IO]]
    (ebayClient, cexClient)
  }
}
