package ebayapp.services

import java.time.Instant
import cats.effect.IO
import ebayapp.CatsSpec
import ebayapp.common.config.SearchQuery
import ebayapp.domain.{ResellableItem, ResellableItemBuilder}
import ebayapp.repositories.ResellableItemRepository.VideoGameRepository

class ResellableItemServiceSpec extends CatsSpec {

  val videoGame = ResellableItemBuilder.videoGame("super mario 3")

  "A VideoGameService" should {
    "check if item is new" in {
      val repository = mock[VideoGameRepository[IO]]
      when(repository.existsByUrl(any[String])).thenReturn(IO.pure(true))

      val isNewResult = ResellableItemService.videoGame(repository).flatMap(_.isNew(videoGame))

      isNewResult.unsafeToFuture().map { isNew =>
        verify(repository).existsByUrl(videoGame.listingDetails.url)
        isNew must be (false)
      }
    }

    "store item in db" in {
      val repository = mock[VideoGameRepository[IO]]
      when(repository.save(any[ResellableItem.VideoGame])).thenReturn(IO.unit)

      val saveResult = ResellableItemService.videoGame(repository).flatMap(_.save(videoGame))

      saveResult.unsafeToFuture().map { saved =>
        verify(repository).save(videoGame)
        saved must be (())
      }
    }

    "stream latest items from db" in {
      val repository = mock[VideoGameRepository[IO]]
      when(repository.stream(any[Option[Int]], any[Option[Instant]], any[Option[Instant]])).thenReturn(fs2.Stream.evalSeq(IO.pure(List(videoGame))))

      val latestResult = ResellableItemService
        .videoGame(repository)
        .flatMap(_.stream(Some(10), None, None).compile.toList)

      latestResult.unsafeToFuture().map { latest =>
        verify(repository).stream(Some(10), None, None)
        latest must be (List(videoGame))
      }
    }

    "get latest items from db" in {
      val repository = mock[VideoGameRepository[IO]]
      when(repository.findAll(any[Option[Int]], any[Option[Instant]], any[Option[Instant]])).thenReturn(IO.pure(List(videoGame)))

      val latestResult = ResellableItemService
        .videoGame(repository)
        .flatMap(_.findAll(Some(10), None, None))

      latestResult.unsafeToFuture().map { latest =>
        verify(repository).findAll(Some(10), None, None)
        latest must be (List(videoGame))
      }
    }

    "get latest items from db by query" in {
      val repository = mock[VideoGameRepository[IO]]
      when(repository.search(any[SearchQuery], any[Option[Int]], any[Option[Instant]], any[Option[Instant]]))
        .thenReturn(IO.pure(List(videoGame)))

      val latestResult = ResellableItemService
        .videoGame(repository)
        .flatMap(_.findBy(SearchQuery("foo"), Some(10), None, None))

      latestResult.unsafeToFuture().map { latest =>
        verify(repository).search(SearchQuery("foo"), Some(10), None, None)
        latest must be (List(videoGame))
      }
    }
  }
}
