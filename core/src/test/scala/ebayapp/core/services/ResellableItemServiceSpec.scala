package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.domain.{ItemKind, ResellableItemBuilder}
import ebayapp.core.repositories.{Filters, ResellableItemRepository}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.{verify, when}

class ResellableItemServiceSpec extends CatsSpec {

  val videoGame = ResellableItemBuilder.videoGame("super mario 3")
  val searchFilters = Filters(ItemKind.VideoGame, Some(100), None, None)

  "A VideoGameService" should {

    "stream latest items from db" in {
      val repository = mock[ResellableItemRepository[IO]]
      when(repository.stream(any[Filters])).thenReturn(fs2.Stream.evalSeq(IO.pure(List(videoGame))))

      val latestResult = ResellableItemService.make(repository).flatMap(_.stream(searchFilters).compile.toList)

      latestResult.unsafeToFuture().map { latest =>
        verify(repository).stream(searchFilters)
        latest mustBe List(videoGame)
      }
    }

    "get latest items from db" in {
      val repository = mock[ResellableItemRepository[IO]]
      when(repository.findAll(any[Filters])).thenReturn(IO.pure(List(videoGame)))

      val latestResult = ResellableItemService.make(repository).flatMap(_.findAll(searchFilters))

      latestResult.unsafeToFuture().map { latest =>
        verify(repository).findAll(searchFilters)
        latest mustBe List(videoGame)
      }
    }

    "get latest items from db by query" in {
      val repository = mock[ResellableItemRepository[IO]]
      when(repository.search(any[String], any[Filters])).thenReturn(IO.pure(List(videoGame)))

      val latestResult = ResellableItemService.make(repository).flatMap(_.findBy("foo", searchFilters))

      latestResult.unsafeToFuture().map { latest =>
        verify(repository).search("foo", searchFilters)
        latest mustBe List(videoGame)
      }
    }
  }
}
