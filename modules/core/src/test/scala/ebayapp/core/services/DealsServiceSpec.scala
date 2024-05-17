package ebayapp.core.services

import cats.effect.IO
import ebayapp.core.{MockRetailConfigProvider, MockLogger}
import ebayapp.core.clients.cex.CexClient
import ebayapp.core.clients.SearchClient
import ebayapp.core.common.Logger
import ebayapp.core.common.config.{DealsFinderConfig, DealsFinderRequest}
import ebayapp.core.domain.ResellableItemBuilder.makeVideoGame
import ebayapp.core.domain.search.{BuyPrice, SearchCriteria, SellPrice}
import ebayapp.core.domain.{ResellableItem, ResellableItemBuilder, Retailer}
import ebayapp.core.repositories.ResellableItemRepository
import kirill5k.common.cats.test.IOWordSpec

import scala.concurrent.duration.*

class DealsServiceSpec extends IOWordSpec {

  given Logger[IO] = MockLogger.make[IO]

  val game1 = makeVideoGame("super mario 3", sellPrice = None)
  val game2 = makeVideoGame("Battlefield 1", sellPrice = None)

  val request1 = DealsFinderRequest(SearchCriteria("q1", Some("cat1")), 34, Some(10))
  val request2 = DealsFinderRequest(SearchCriteria("q2", Some("cat2")), 100, Some(10))

  def config(c: DealsFinderConfig) = MockRetailConfigProvider.make[IO](dealsFinderConfigs = Map(Retailer.Ebay -> c))

  "An DealsSearchService" should {

    "search ebay for new deals" in {
      val (searchClient, cexClient, repo) = mockDependecies
      when(searchClient.search(any[SearchCriteria])).thenStream(game1, game2)
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(false))
      when(repo.save(any[ResellableItem])).thenReturnUnit

      doAnswer(inv => IO.pure(inv.getArgument[ResellableItem](0).copy(sellPrice = Some(SellPrice(BigDecimal(50), BigDecimal(50))))))
        .when(cexClient)
        .withUpdatedSellPrice(any[ResellableItem])

      val result = for
        service <- DealsService.make(Retailer.Ebay, config(DealsFinderConfig(2.seconds, List(request1))), searchClient, cexClient, repo)
        items   <- service.newDeals.interruptAfter(1.seconds).compile.toList
      yield items

      result.asserting { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(cexClient).withUpdatedSellPrice(game1)
        verify(cexClient).withUpdatedSellPrice(game2)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verify(repo, times(2)).save(any[ResellableItem])
        items.map(_.itemDetails) mustBe List(game1.itemDetails, game2.itemDetails)
        items.flatMap(_.sellPrice).toSet mustBe Set(SellPrice(BigDecimal(50), BigDecimal(50)))
      }
    }

    "ignore items that are not new" in {
      val (searchClient, cexClient, repo) = mockDependecies
      when(searchClient.search(any[SearchCriteria])).thenStream(game1, game2)
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(true))

      val result = for
        service <- DealsService.make(Retailer.Ebay, config(DealsFinderConfig(2.seconds, List(request1))), searchClient, cexClient, repo)
        items   <- service.newDeals.interruptAfter(1.seconds).compile.toList
      yield items

      result.asserting { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verifyNoMoreInteractions(repo)
        verifyNoInteractions(cexClient)
        items mustBe Nil
      }
    }

    "ignore items that have too much quantity" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria])).thenStream(List(game1, game2).map(_.copy(buyPrice = BuyPrice(100, BigDecimal(10)))))
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(false))
      when(repo.save(any[ResellableItem])).thenReturnUnit

      doAnswer(inv => IO.pure(inv.getArgument[ResellableItem](0).copy(sellPrice = Some(SellPrice(BigDecimal(50), BigDecimal(50))))))
        .when(cexClient)
        .withUpdatedSellPrice(any[ResellableItem])

      val result = for
        service <- DealsService.make(Retailer.Ebay, config(DealsFinderConfig(2.seconds, List(request1))), searchClient, cexClient, repo)
        items   <- service.newDeals.interruptAfter(1.seconds).compile.toList
      yield items

      result.asserting { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verify(cexClient, times(2)).withUpdatedSellPrice(any[ResellableItem])
        verify(repo, times(2)).save(any[ResellableItem])
        items.map(_.itemDetails) mustBe Nil
      }
    }

    "ignore items without resell price" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria])).thenStream(game1, game2)
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(false))
      when(repo.save(any[ResellableItem])).thenReturnUnit

      doAnswer(inv => IO.pure(inv.getArgument[ResellableItem](0)))
        .when(cexClient)
        .withUpdatedSellPrice(any[ResellableItem])

      val result = for
        service <- DealsService.make(Retailer.Ebay, config(DealsFinderConfig(2.seconds, List(request1))), searchClient, cexClient, repo)
        items   <- service.newDeals.interruptAfter(1.seconds).compile.toList
      yield items

      result.asserting { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(cexClient).withUpdatedSellPrice(game1)
        verify(cexClient).withUpdatedSellPrice(game2)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verify(repo).save(game1)
        verify(repo).save(game2)
        items.map(_.itemDetails) mustBe Nil
      }
    }

    "ignore items that are not profitable" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria])).thenStream(game1, game2)
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(false))
      when(repo.save(any[ResellableItem])).thenReturnUnit

      doAnswer(inv => IO.pure(inv.getArgument[ResellableItem](0).copy(sellPrice = Some(SellPrice(BigDecimal(40), BigDecimal(40))))))
        .when(cexClient)
        .withUpdatedSellPrice(any[ResellableItem])

      val result = for
        service <- DealsService.make(Retailer.Ebay, config(DealsFinderConfig(2.seconds, List(request1))), searchClient, cexClient, repo)
        items   <- service.newDeals.interruptAfter(1.seconds).compile.toList
      yield items

      result.asserting { items =>
        verify(searchClient).search(request1.searchCriteria)
        verify(cexClient).withUpdatedSellPrice(game1)
        verify(cexClient).withUpdatedSellPrice(game2)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verify(repo).existsByUrl(game2.listingDetails.url)
        verify(repo, times(2)).save(any[ResellableItem])
        items.map(_.itemDetails) mustBe Nil
      }
    }

    "process multiple requests in parallel continuously" in {
      val (searchClient, cexClient, repo) = mockDependecies

      when(searchClient.search(any[SearchCriteria])).thenReturnEmptyStream

      val result = for
        service <- DealsService.make(
          Retailer.Ebay,
          config(DealsFinderConfig(1.seconds, List(request1, request2))),
          searchClient,
          cexClient,
          repo
        )
        items <- service.newDeals.interruptAfter(3400.millis).compile.toList
      yield items

      result.asserting { items =>
        verify(searchClient, times(3)).search(request1.searchCriteria)
        verify(searchClient, times(3)).search(request2.searchCriteria)
        verifyNoInteractions(cexClient, repo)
        items.map(_.itemDetails) mustBe Nil
      }
    }

    "handle errors gracefully" in {
      val (searchClient, cexClient, repo) = mockDependecies
      when(searchClient.search(any[SearchCriteria])).thenFailStream(new RuntimeException("foo")).thenStream(game1)
      when(repo.existsByUrl(any[String])).thenReturn(IO.pure(true))

      val result = for
        service <- DealsService.make(Retailer.Ebay, config(DealsFinderConfig(2.seconds, List(request1))), searchClient, cexClient, repo)
        items   <- service.newDeals.interruptAfter(4.seconds).compile.toList
      yield items

      result.asserting { items =>
        verify(searchClient, times(2)).search(request1.searchCriteria)
        verify(repo).existsByUrl(game1.listingDetails.url)
        verifyNoInteractions(cexClient)
        items mustBe Nil
      }
    }
  }

  def mockDependecies: (SearchClient[IO], CexClient[IO], ResellableItemRepository[IO]) = {
    val searchClient = mock[SearchClient[IO]]
    val cexClient    = mock[CexClient[IO]]
    val repository   = mock[ResellableItemRepository[IO]]
    (searchClient, cexClient, repository)
  }
}
