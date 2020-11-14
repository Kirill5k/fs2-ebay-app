package ebayapp.services

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.clients.cex.CexClient
import ebayapp.clients.ebay.EbayClient
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.common.config.{EbayDealsConfig, SearchQuery}
import ebayapp.domain.ItemDetails.Game
import ebayapp.domain.{ResellableItem, ResellableItemBuilder}
import fs2.Stream

import scala.concurrent.duration._

class EbayDealsServiceSpec extends CatsSpec {

  val videoGame  = ResellableItemBuilder.videoGame("super mario 3")
  val videoGame2 = ResellableItemBuilder.videoGame("Battlefield 1", sellPrice = None)

  implicit val mapper: EbayItemMapper[Game]   = EbayItemMapper.gameDetailsMapper
  implicit val params: EbaySearchParams[Game] = EbaySearchParams.videoGameSearchParams

  "An EbayDealsSearchService" should {

    "search ebay for new deals continuously" in {
      val dealsConfig             = EbayDealsConfig(2.seconds, List(SearchQuery("q1"), SearchQuery("q2")), 5.minutes, 5, 10)
      val (ebayClient, cexClient) = mockDependecies

      when(ebayClient.findLatestItems[Game](eqTo(SearchQuery("q1")), eqTo(5.minutes))(eqTo(mapper), eqTo(params)))
        .thenReturn(Stream.evalSeq(IO.pure(List(videoGame, videoGame2))))
        .andThen(Stream.empty)

      when(ebayClient.findLatestItems[Game](eqTo(SearchQuery("q2")), eqTo(5.minutes))(eqTo(mapper), eqTo(params)))
        .thenReturn(Stream.empty)

      doReturn(IO.pure(videoGame.sellPrice))
        .doReturn(IO.pure(None))
        .when(cexClient)
        .findSellPrice(any[SearchQuery])

      val result = for {
        service <- EbayDealsService.make(ebayClient, cexClient)
        items   <- service.deals(dealsConfig).interruptAfter(3.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(ebayClient, times(2)).findLatestItems[Game](SearchQuery("q1"), 5.minutes)
        verify(ebayClient, times(2)).findLatestItems[Game](SearchQuery("q2"), 5.minutes)
        verify(cexClient, times(2)).findSellPrice(any[SearchQuery])
        items mustBe List(videoGame, videoGame2)
      }
    }

    "leave resell price as None when not enough details for query" in {
      val dealsConfig             = EbayDealsConfig(10.seconds, List(SearchQuery("q1")), 5.minutes, 5, 10)
      val (ebayClient, cexClient) = mockDependecies
      val itemDetails             = videoGame.itemDetails.copy(platform = None)
      val searchResponse          = List(videoGame.copy(itemDetails = itemDetails, sellPrice = None))

      when(ebayClient.findLatestItems[Game](any[SearchQuery], any[FiniteDuration])(eqTo(mapper), eqTo(params)))
        .thenReturn(Stream.evalSeq(IO.pure(searchResponse)))

      val result = for {
        service <- EbayDealsService.make(ebayClient, cexClient)
        items   <- service.deals(dealsConfig).interruptAfter(1.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(ebayClient).findLatestItems[Game](SearchQuery("q1"), 5.minutes)
        verify(cexClient, never).findSellPrice(any[SearchQuery])
        items must be(List(ResellableItem(itemDetails, videoGame.listingDetails, videoGame.buyPrice, None)))
      }
    }

    "handle errors gracefully" in {
      val dealsConfig             = EbayDealsConfig(2.seconds, List(SearchQuery("q1")), 5.minutes, 5, 10)
      val (ebayClient, cexClient) = mockDependecies

      when(ebayClient.findLatestItems[Game](any[SearchQuery], any[FiniteDuration])(eqTo(mapper), eqTo(params)))
        .thenReturn(Stream.eval(IO.raiseError(new RuntimeException())))
        .andThen((Stream.evalSeq(IO.pure(List(videoGame)))))

      when(cexClient.findSellPrice(any[SearchQuery])).thenReturn(IO.pure(videoGame.sellPrice))

      val result = for {
        service <- EbayDealsService.make(ebayClient, cexClient)
        items   <- service.deals(dealsConfig).interruptAfter(3.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(ebayClient, times(2)).findLatestItems[Game](SearchQuery("q1"), 5.minutes)
        verify(cexClient).findSellPrice(any[SearchQuery])
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
