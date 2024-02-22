package ebayapp.core.services

import cats.effect.IO
import ebayapp.kernel.IOWordSpec
import ebayapp.core.domain.{ItemKind, SearchParams}
import ebayapp.core.domain.ResellableItemBuilder.*
import ebayapp.core.repositories.ResellableItemRepository

class ResellableItemServiceSpec extends IOWordSpec {

  val videoGame     = makeVideoGame("super mario 3")
  val summary       = videoGame.summary
  val searchFilters = SearchParams(Some(ItemKind.VideoGame), Some(100), None, None)

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
