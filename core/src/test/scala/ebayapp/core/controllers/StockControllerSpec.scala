package ebayapp.core.controllers

import cats.effect.IO
import ebayapp.core.clients.Retailer
import ebayapp.core.domain.ResellableItemBuilder
import ebayapp.core.services.StockService
import ebayapp.kernel.ControllerSpec
import org.http4s.implicits.*
import org.http4s.*

import java.time.Instant

class StockControllerSpec extends ControllerSpec {

  val ts = Instant.now

  "A StockController" should {

    "return all items from currently tracked stock" in {
      val services = mocks(Retailer.Scotts, Retailer.Selfridges)

      val controller = new StockController[IO](services)

      val request = Request[IO](uri = uri"/stock", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      val expectedResponse =
        s"""[
          |  {
          |    "kind" : "clothing",
          |    "itemDetails" : {
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
          |    }
          |  },
          |  {
          |    "kind" : "clothing",
          |    "itemDetails" : {
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
          |    }
          |  }
          |]""".stripMargin

      verifyJsonResponse(response, Status.Ok, Some(expectedResponse))
      services.foreach { svc =>
        verify(svc).cachedItems
      }
    }

    "return error when provided unrecognised retailer" in {
      val controller = new StockController[IO](Nil)

      val request = Request[IO](uri = uri"/stock?retailer=foo", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.UnprocessableEntity, Some("""{"message":"unrecognized retailer foo"}"""))
    }

    "return items for a specific retailer" in {
      val services = mocks(Retailer.Scotts, Retailer.Selfridges)

      val controller = new StockController[IO](services)

      val request = Request[IO](uri = uri"/stock?retailer=scotts", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      val expectedResponse =
        s"""[
           |  {
           |    "kind" : "clothing",
           |    "itemDetails" : {
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
           |    }
           |  }
           |]""".stripMargin

      verifyJsonResponse(response, Status.Ok, Some(expectedResponse))
      services.foreach { svc =>
        verify(svc).retailer
      }
    }
  }

  def mocks(retailers: Retailer*): List[StockService[IO]] =
    retailers.toList.map { r =>
      val svc = mock[StockService[IO]]
      val item = ResellableItemBuilder.clothing(s"${r.name} item", retailer = r, datePosted = ts)
      when(svc.retailer).thenReturn(r)
      when(svc.cachedItems).thenReturn(IO.pure(List(item)))
      svc
    }
}
