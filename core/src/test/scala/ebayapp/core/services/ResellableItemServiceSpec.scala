package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.IOWordSpec
import ebayapp.core.domain.{ItemKind, ItemSummary, ResellableItemBuilder}
import ebayapp.core.repositories.{ResellableItemRepository, SearchParams}

class ResellableItemServiceSpec extends IOWordSpec {

  val videoGame = ResellableItemBuilder.videoGame("super mario 3")
  val summary = ItemSummary(
    videoGame.itemDetails.fullName,
    videoGame.listingDetails.title,
    videoGame.listingDetails.url,
    videoGame.buyPrice.rrp,
    videoGame.sellPrice.map(_.credit)
  )
  val searchFilters = SearchParams(ItemKind.VideoGame, Some(100), None, None)

  "A VideoGameService" should {

    "get latest items from db" in {
      val repository = mock[ResellableItemRepository[IO]]
      when(repository.search(any[SearchParams])).thenReturnIO(List(videoGame))

      val latestResult = ResellableItemService.make(repository).flatMap(_.search(searchFilters))

      latestResult.asserting { latest =>
        verify(repository).search(searchFilters)
        latest mustBe List(videoGame)
      }
    }

    "get item summaries from db" in {
      val repository = mock[ResellableItemRepository[IO]]
      when(repository.summaries(any[SearchParams])).thenReturnIO(List(summary))

      val result = ResellableItemService.make(repository).flatMap(_.summaries(searchFilters))

      result.asserting { res =>
        verify(repository).summaries(searchFilters)
        res mustBe List(summary)
      }
    }
  }
}
