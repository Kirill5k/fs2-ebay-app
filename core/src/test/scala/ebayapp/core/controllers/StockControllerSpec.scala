package ebayapp.core.controllers

import cats.effect.IO
import ebayapp.core.domain.ResellableItemBuilder
import ebayapp.core.domain.Retailer
import ebayapp.core.services.StockService
import ebayapp.kernel.ControllerSpec
import org.http4s.implicits.*
import org.http4s.*
import org.mockito.Mockito

import java.time.Instant

class StockControllerSpec extends ControllerSpec {

  val ts = Instant.now

  "A StockController" when {

    "GET /stock" should {
      "return all items from currently tracked stock" in {
        val services = mocks(Retailer.Scotts, Retailer.Selfridges)

        val controller = new StockController[IO](services.values.toList)

        val request  = Request[IO](uri = uri"/stock", method = Method.GET)
        val response = controller.routes.orNotFound.run(request)

        val expectedResponse =
          s"""[
             |  {
             |    "itemDetails" : {
             |      "kind" : "clothing",
             |      "name" : "selfridges item",
             |      "brand" : "Foo-bar",
             |      "size" : "XXL"
             |    },
             |    "listingDetails" : {
             |      "url" : "http://cex.com/selfridgesitem",
             |      "title" : "selfridges item",
             |      "category" : null,
             |      "shortDescription" : null,
             |      "description" : null,
             |      "image" : null,
             |      "condition" : "USED",
             |      "datePosted" : "${ts}",
             |      "seller" : "SELFRIDGES",
             |      "properties" : {}
             |    },
             |    "price" : {
             |      "buy" : 100.0,
             |      "discount" : 50,
             |      "quantityAvailable" : 1,
             |      "sell" : null,
             |      "credit" : null
             |    },
             |    "foundWith" : "item"
             |  },
             |  {
             |    "itemDetails" : {
             |      "kind" : "clothing",
             |      "name" : "scotts item",
             |      "brand" : "Foo-bar",
             |      "size" : "XXL"
             |    },
             |    "listingDetails" : {
             |      "url" : "http://cex.com/scottsitem",
             |      "title" : "scotts item",
             |      "category" : null,
             |      "shortDescription" : null,
             |      "description" : null,
             |      "image" : null,
             |      "condition" : "USED",
             |      "datePosted" : "${ts}",
             |      "seller" : "SCOTTS",
             |      "properties" : {}
             |    },
             |    "price" : {
             |      "buy" : 100.0,
             |      "discount" : 50,
             |      "quantityAvailable" : 1,
             |      "sell" : null,
             |      "credit" : null
             |    },
             |    "foundWith" : "item"
             |  }
             |]""".stripMargin

        response mustHaveStatus (Status.Ok, Some(expectedResponse))
        services.foreach((_, svc) => verify(svc).cachedItems)
      }

      "filter items by query" in {
        val services = mocks(Retailer.Scotts, Retailer.Selfridges)

        val controller = new StockController[IO](services.values.toList)

        val request  = Request[IO](uri = uri"/stock?query=selfridges", method = Method.GET)
        val response = controller.routes.orNotFound.run(request)

        val expectedResponse =
          s"""[
             |  {
             |    "itemDetails" : {
             |      "kind" : "clothing",
             |      "name" : "selfridges item",
             |      "brand" : "Foo-bar",
             |      "size" : "XXL"
             |    },
             |    "listingDetails" : {
             |      "url" : "http://cex.com/selfridgesitem",
             |      "title" : "selfridges item",
             |      "category" : null,
             |      "shortDescription" : null,
             |      "description" : null,
             |      "image" : null,
             |      "condition" : "USED",
             |      "datePosted" : "${ts}",
             |      "seller" : "SELFRIDGES",
             |      "properties" : {}
             |    },
             |    "price" : {
             |      "buy" : 100.0,
             |      "discount" : 50,
             |      "quantityAvailable" : 1,
             |      "sell" : null,
             |      "credit" : null
             |    },
             |    "foundWith" : "item"
             |  }
             |]""".stripMargin

        response mustHaveStatus (Status.Ok, Some(expectedResponse))
        services.foreach((_, svc) => verify(svc).cachedItems)
      }
    }

    "GET /stock/:retailer" should {
      "return error when provided unrecognised retailer" in {
        val controller = new StockController[IO](Nil)

        val request  = Request[IO](uri = uri"/stock/foo", method = Method.GET)
        val response = controller.routes.orNotFound.run(request)

        response mustHaveStatus (Status.UnprocessableEntity, Some("""{"message":"unrecognized retailer foo"}"""))
      }

      "return error when retailer is not monitored" in {
        val controller = new StockController[IO](Nil)

        val request  = Request[IO](uri = uri"/stock/scotts", method = Method.GET)
        val response = controller.routes.orNotFound.run(request)

        response mustHaveStatus (Status.UnprocessableEntity, Some("""{"message":"Scotts is not being monitored"}"""))
      }

      "return items for a specific retailer" in {
        val services = mocks(Retailer.Scotts, Retailer.Selfridges)

        val controller = new StockController[IO](services.values.toList)

        val request  = Request[IO](uri = uri"/stock/scotts", method = Method.GET)
        val response = controller.routes.orNotFound.run(request)

        val expectedResponse =
          s"""[
             |  {
             |    "itemDetails" : {
             |      "kind" : "clothing",
             |      "name" : "scotts item",
             |      "brand" : "Foo-bar",
             |      "size" : "XXL"
             |    },
             |    "listingDetails" : {
             |      "url" : "http://cex.com/scottsitem",
             |      "title" : "scotts item",
             |      "category" : null,
             |      "shortDescription" : null,
             |      "description" : null,
             |      "image" : null,
             |      "condition" : "USED",
             |      "datePosted" : "${ts}",
             |      "seller" : "SCOTTS",
             |      "properties" : {}
             |    },
             |    "price" : {
             |      "buy" : 100.0,
             |      "discount" : 50,
             |      "quantityAvailable" : 1,
             |      "sell" : null,
             |      "credit" : null
             |    },
             |    "foundWith" : "item"
             |  }
             |]""".stripMargin

        response mustHaveStatus (Status.Ok, Some(expectedResponse))
        verify(services(Retailer.Scotts)).retailer
        verify(services(Retailer.Scotts)).cachedItems
        verify(services(Retailer.Selfridges), Mockito.never()).cachedItems
      }
    }

    "PUT /stock/:retailer/pause" should {
      "pause stock monitor for a retailer" in {
        val services = mocks(Retailer.Scotts, Retailer.Selfridges)

        val controller = new StockController[IO](services.values.toList)

        val request  = Request[IO](uri = uri"/stock/scotts/pause", method = Method.PUT)
        val response = controller.routes.orNotFound.run(request)

        response mustHaveStatus (Status.NoContent, None)
        verify(services(Retailer.Scotts)).pause
        verify(services(Retailer.Scotts)).retailer
        verifyNoMoreInteractions(services(Retailer.Scotts))
        verifyNoInteractions(services(Retailer.Selfridges))
      }
    }

    "PUT /stock/:retailer/resume" should {
      "resume stock monitor for a retailer" in {
        val services = mocks(Retailer.Scotts, Retailer.Selfridges)

        val controller = new StockController[IO](services.values.toList)

        val request  = Request[IO](uri = uri"/stock/scotts/resume", method = Method.PUT)
        val response = controller.routes.orNotFound.run(request)

        response mustHaveStatus (Status.NoContent, None)
        verify(services(Retailer.Scotts)).resume
        verify(services(Retailer.Scotts)).retailer
        verifyNoMoreInteractions(services(Retailer.Scotts))
        verifyNoInteractions(services(Retailer.Selfridges))
      }
    }
  }

  def mocks(retailers: Retailer*): Map[Retailer, StockService[IO]] =
    retailers.map { r =>
      val svc  = mock[StockService[IO]]
      val item = ResellableItemBuilder.clothing(s"${r.name} item", retailer = r, datePosted = ts)
      when(svc.retailer).thenReturn(r)
      when(svc.pause).thenReturnUnit
      when(svc.resume).thenReturnUnit
      when(svc.cachedItems).thenReturnIO(List(item))
      r -> svc
    }.toMap
}
