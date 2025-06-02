package ebayapp.core.services

import cats.effect.IO
import kirill5k.common.cats.test.IOWordSpec
import ebayapp.core.domain.{ItemKind, SearchParams}
import ebayapp.core.domain.ResellableItemBuilder.*
import ebayapp.core.repositories.ResellableItemRepository

class ResellableItemServiceSpec extends IOWordSpec {

  val videoGame     = makeVideoGame("super mario 3")
  val searchFilters = SearchParams(kind = Some(ItemKind.VideoGame), limit = Some(100))

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
  }
}
