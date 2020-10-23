package ebayapp.services

import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.clients.cex.CexClient
import ebayapp.clients.ebay.EbayClient
import ebayapp.clients.ebay.mappers.EbayItemMapper
import ebayapp.clients.ebay.search.EbaySearchParams
import ebayapp.domain.ItemDetails.Game
import ebayapp.domain.search.SearchQuery
import ebayapp.domain.{ResellableItem, ResellableItemBuilder}
import fs2.Stream

import scala.concurrent.duration._

class EbayDealsSearchServiceSpec extends CatsSpec {

  val videoGame = ResellableItemBuilder.videoGame("super mario 3")
  val videoGame2 = ResellableItemBuilder.videoGame("Battlefield 1", resellPrice = None)

  "An EbayVideoGameSearchService" should {
    "return new items from ebay" in {
      val (ebayClient, cexClient) = mockDependecies
      val searchResponse = List(videoGame, videoGame2)

      when(ebayClient.findLatestItems[Game](any[SearchQuery], any[FiniteDuration])(any[EbayItemMapper[Game]], any[EbaySearchParams[Game]]))
        .thenReturn(Stream.evalSeq(IO.pure(searchResponse)))

      doReturn(IO.pure(videoGame.sellPrice))
        .doReturn(IO.pure(None))
        .when(cexClient).findResellPrice(any[SearchQuery])

      val service = EbayDealsSearchService.videoGames(ebayClient, cexClient)

      val latestItemsResponse = service.flatMap(_.find(SearchQuery("xbox"), 10.minutes).compile.toList)

      latestItemsResponse.unsafeToFuture().map { items =>
        verify(ebayClient).findLatestItems[Game](SearchQuery("xbox"), 10.minutes)
        verify(cexClient, times(2)).findResellPrice(any[SearchQuery])
        items must be (List(videoGame, videoGame2))
      }
    }

    "leave resell price as None when not enough details for query" in {
      val (ebayClient, cexClient) = mockDependecies
      val itemDetails = videoGame.itemDetails.copy(platform = None)
      val searchResponse = List(videoGame.copy(itemDetails = itemDetails, sellPrice = None))

      when(ebayClient.findLatestItems[Game](any[SearchQuery], any[FiniteDuration])(any[EbayItemMapper[Game]], any[EbaySearchParams[Game]]))
        .thenReturn(Stream.evalSeq(IO.pure(searchResponse)))

      val service = EbayDealsSearchService.videoGames(ebayClient, cexClient)

      val latestItemsResponse = service.flatMap(_.find(SearchQuery("xbox"), 10.minutes).compile.toList)

      latestItemsResponse.unsafeToFuture().map { items =>
        verify(ebayClient).findLatestItems[Game](SearchQuery("xbox"), 10.minutes)
        verify(cexClient, never).findResellPrice(any[SearchQuery])
        items must be (List(ResellableItem(itemDetails, videoGame.listingDetails, videoGame.buyPrice, None)))
      }
    }
  }

  def mockDependecies: (EbayClient[IO], CexClient[IO]) = {
    val ebayClient = mock[EbayClient[IO]]
    val cexClient = mock[CexClient[IO]]
    (ebayClient, cexClient)
  }
}
