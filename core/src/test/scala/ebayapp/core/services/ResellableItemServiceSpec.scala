package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.domain.{ItemKind, ItemSummary, ResellableItemBuilder}
import ebayapp.core.repositories.{SearchParams, ResellableItemRepository}

class ResellableItemServiceSpec extends CatsSpec {

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
      when(repository.search(any[SearchParams])).thenReturn(IO.pure(List(videoGame)))

      val latestResult = ResellableItemService.make(repository).flatMap(_.search(searchFilters))

      latestResult.unsafeToFuture().map { latest =>
        verify(repository).search(searchFilters)
        latest mustBe List(videoGame)
      }
    }

    "get item summaries from db" in {
      val repository = mock[ResellableItemRepository[IO]]
      when(repository.summaries(any[SearchParams])).thenReturn(IO.pure(List(summary)))

      val result = ResellableItemService.make(repository).flatMap(_.summaries(searchFilters))

      result.unsafeToFuture().map { res =>
        verify(repository).summaries(searchFilters)
        res mustBe List(summary)
      }
    }
  }
}
