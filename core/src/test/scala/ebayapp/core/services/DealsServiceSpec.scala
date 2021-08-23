package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.CatsSpec
import ebayapp.core.clients.{SearchClient, SearchCriteria}
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.common.config.{DealsFinderConfig, DealsFinderRequest}
import ebayapp.core.domain.search.{BuyPrice, SellPrice}
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder}
import ebayapp.core.repositories.ResellableItemRepository
import fs2.Stream

import scala.concurrent.duration._

class DealsServiceSpec extends CatsSpec {

  val game1 = ResellableItemBuilder.videoGame("super mario 3", sellPrice = None)
  val game2 = ResellableItemBuilder.videoGame("Battlefield 1", sellPrice = None)

  val request1 = DealsFinderRequest(SearchCriteria("q1", Some("cat1")), 34, Some(10))
  val request2 = DealsFinderRequest(SearchCriteria("q2", Some("cat2")), 100, Some(10))

  "An DealsSearchService" should {

    "search ebay for new deals" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria])).thenReturn(Stream.emits(List(game1, game2)))

      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(false))
      when(repo.save(any[ResellableItem])).thenReturn(IO.unit)

      doAnswer((_: Option[String], i: ResellableItem) => IO.pure(i.copy(sellPrice = Some(SellPrice(BigDecimal(50), BigDecimal(50))))))
        .when(cexClient)
        .withUpdatedSellPrice(any[Option[String]])(any[ResellableItem])

      val result = for {
        service <- DealsService.ebay(searchClient, cexClient, repo)
        items   <- service.newDeals(DealsFinderConfig(2.seconds, List(request1))).interruptAfter(1.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(cexClient).withUpdatedSellPrice(Some("cat1"))(game1)
        verify(cexClient).withUpdatedSellPrice(Some("cat1"))(game2)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verify(repo, times(2)).save(any[ResellableItem])
        items.map(_.itemDetails) mustBe List(game1.itemDetails, game2.itemDetails)
        items.flatMap(_.sellPrice).toSet mustBe Set(SellPrice(BigDecimal(50), BigDecimal(50)))
      }
    }

    "ignore items that are not new" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria])).thenReturn(Stream.emits(List(game1, game2)))
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(true))

      val result = for {
        service <- DealsService.ebay(searchClient, cexClient, repo)
        items   <- service.newDeals(DealsFinderConfig(2.seconds, List(request1))).interruptAfter(1.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verifyNoMoreInteractions(repo)
        verifyZeroInteractions(cexClient)
        items mustBe Nil
      }
    }

    "ignore items that have too much quantity" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria]))
        .thenReturn(Stream.emits(List(game1, game2).map(_.copy(buyPrice = BuyPrice(100, BigDecimal(10))))))
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(false))
      when(repo.save(any[ResellableItem])).thenReturn(IO.unit)

      doAnswer((_: Option[String], i: ResellableItem) => IO.pure(i.copy(sellPrice = Some(SellPrice(BigDecimal(50), BigDecimal(50))))))
        .when(cexClient)
        .withUpdatedSellPrice(any[Option[String]])(any[ResellableItem])

      val result = for {
        service <- DealsService.ebay(searchClient, cexClient, repo)
        items   <- service.newDeals(DealsFinderConfig(2.seconds, List(request1))).interruptAfter(1.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verify(cexClient, times(2)).withUpdatedSellPrice(any[Option[String]])(any[ResellableItem])
        verify(repo, times(2)).save(any[ResellableItem])
        items.map(_.itemDetails) mustBe Nil
      }
    }

    "ignore items without resell price" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria])).thenReturn(Stream.emits(List(game1, game2)))
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(false))
      when(repo.save(any[ResellableItem])).thenReturn(IO.unit)

      doAnswer((_: Option[String], i: ResellableItem) => IO.pure(i))
        .when(cexClient)
        .withUpdatedSellPrice(any[Option[String]])(any[ResellableItem])

      val result = for {
        service <- DealsService.ebay(searchClient, cexClient, repo)
        items   <- service.newDeals(DealsFinderConfig(2.seconds, List(request1))).interruptAfter(1.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(cexClient).withUpdatedSellPrice(Some("cat1"))(game1)
        verify(cexClient).withUpdatedSellPrice(Some("cat1"))(game2)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verify(repo).save(game1)
        verify(repo).save(game2)
        items.map(_.itemDetails) mustBe Nil
      }
    }

    "ignore items that are not profitable" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria])).thenReturn(Stream.emits(List(game1, game2)))
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(false))
      when(repo.save(any[ResellableItem])).thenReturn(IO.unit)

      doAnswer((_: Option[String], i: ResellableItem) => IO.pure(i.copy(sellPrice = Some(SellPrice(BigDecimal(40), BigDecimal(40))))))
        .when(cexClient)
        .withUpdatedSellPrice(any[Option[String]])(any[ResellableItem])

      val result = for {
        service <- DealsService.ebay(searchClient, cexClient, repo)
        items   <- service.newDeals(DealsFinderConfig(2.seconds, List(request1))).interruptAfter(1.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(cexClient).withUpdatedSellPrice(Some("cat1"))(game1)
        verify(cexClient).withUpdatedSellPrice(Some("cat1"))(game2)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verify(repo, times(2)).save(any[ResellableItem])
        items.map(_.itemDetails) mustBe Nil
      }
    }

    "process multiple requests in parallel continuously" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria])).thenReturn(Stream.empty)

      val result = for {
        service <- DealsService.ebay(searchClient, cexClient, repo)
        items   <- service.newDeals(DealsFinderConfig(2.seconds, List(request1, request2))).interruptAfter(5.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(searchClient, times(3)).search(request1.searchCriteria)
        verify(searchClient, times(3)).search(request2.searchCriteria)
        verifyZeroInteractions(cexClient, repo)
        items.map(_.itemDetails) mustBe Nil
      }
    }

    "handle errors gracefully" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria]))
        .thenReturn(Stream.raiseError[IO](new RuntimeException("foo")))
        .andThen(Stream.emit(game1))

      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(true))

      val result = for {
        service <- DealsService.ebay(searchClient, cexClient, repo)
        items   <- service.newDeals(DealsFinderConfig(2.seconds, List(request1))).interruptAfter(3.seconds).compile.toList
      } yield items

      result.unsafeToFuture().map { items =>
        verify(searchClient, times(2)).search(request1.searchCriteria)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verifyZeroInteractions(cexClient)
        items mustBe Nil
      }
    }
  }

  def mockDependecies: (SearchClient[IO], CexClient[IO], ResellableItemRepository[IO]) = {
    val searchClient = mock[SearchClient[IO]]
    val cexClient  = mock[CexClient[IO]]
    val repository = mock[ResellableItemRepository[IO]]
    (searchClient, cexClient, repository)
  }
}
