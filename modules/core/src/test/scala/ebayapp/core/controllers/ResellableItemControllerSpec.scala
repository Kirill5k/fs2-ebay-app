package ebayapp.core.controllers

import cats.effect.IO
import ebayapp.core.domain.search.SellPrice
import ebayapp.core.domain.{ItemKind, SearchParams}
import ebayapp.core.domain.ResellableItemBuilder.*
import ebayapp.core.services.ResellableItemService
import kirill5k.common.http4s.test.HttpRoutesWordSpec
import org.http4s.implicits.*
import org.http4s.*

import java.time.Instant

class ResellableItemControllerSpec extends HttpRoutesWordSpec {

  val postedTs = Instant.ofEpochMilli(1577836800000L)

  val game1 = makeVideoGame("super mario 3", postedTs)
  val game2 = makeVideoGame("Battlefield 1", postedTs, sellPrice = None)
  val game3 = makeVideoGame("Battlefield 1", postedTs, sellPrice = Some(SellPrice(BigDecimal(10), BigDecimal(5))))

  val summaries = List(game1, game2, game3).map(_.summary)

  val searchFilters = SearchParams(Some(ItemKind.VideoGame), None, None, None)

  "A ResellableItemController" should {

    "return list of resellable items" in {
      val service = mock[ResellableItemService[IO]]
      when(service.search(any[SearchParams])).thenReturnIO(Nil)

      val controller = new ResellableItemController[IO](service)

      val request  = Request[IO](uri = uri"/resellable-items", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      response mustHaveStatus (Status.Ok, Some("""[]"""))
      verify(service).search(SearchParams())
    }

    "return list of resellable items filtered by kind" in {
      val service = mock[ResellableItemService[IO]]
      when(service.search(any[SearchParams])).thenReturnIO(List(game1, game2))

      val controller = new ResellableItemController[IO](service)

      val request  = Request[IO](uri = uri"/resellable-items?kind=video-game", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      val expected =
        """[{
          |"itemDetails":{
          |"kind": "video-game",
          |"name":"super mario 3",
          |"platform":"XBOX ONE",
          |"releaseYear":"2019",
          |"genre":"Action"
          |},
          |"listingDetails":{
          |"url":"https://www.ebay.co.uk/itm/super-mario-3",
          |"title":"super mario 3",
          |"category":"Games",
          |"shortDescription":"super mario 3 xbox one 2019. Condition is New. Game came as part of bundle and not wanted. Never playes. Dispatched with Royal Mail 1st Class Large Letter.",
          |"description":null,
          |"image":"https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg",
          |"condition":"NEW",
          |"datePosted":"2020-01-01T00:00:00Z",
          |"seller":"EBAY:168.robinhood",
          |"properties":{"Game Name":"super mario 3","Release Year":"2019","Platform":"Microsoft Xbox One","Genre":"Action"}
          |},
          |"price":{
          |"buy":32.99,
          |"discount":null,
          |"quantityAvailable":1,
          |"sell":100,
          |"credit":80
          |},
          |"foundWith" : "item"
          |},{
          |"itemDetails":{
          |"kind": "video-game",
          |"name":"Battlefield 1",
          |"platform":"XBOX ONE",
          |"releaseYear":"2019",
          |"genre":"Action"
          |},
          |"listingDetails":{
          |"url":"https://www.ebay.co.uk/itm/battlefield-1",
          |"title":"Battlefield 1",
          |"category":"Games",
          |"shortDescription":"Battlefield 1 xbox one 2019. Condition is New. Game came as part of bundle and not wanted. Never playes. Dispatched with Royal Mail 1st Class Large Letter.",
          |"description":null,
          |"image":"https://i.ebayimg.com/images/g/0kcAAOSw~5ReGFCQ/s-l1600.jpg",
          |"condition":"NEW",
          |"datePosted":"2020-01-01T00:00:00Z",
          |"seller":"EBAY:168.robinhood",
          |"properties":{"Game Name":"Battlefield 1","Release Year":"2019","Platform":"Microsoft Xbox One","Genre":"Action"}
          |},
          |"price":{
          |"buy":32.99,
          |"discount":null,
          |"quantityAvailable":1,
          |"sell":null,
          |"credit":null
          |},
          |"foundWith" : "item"
          |}]""".stripMargin
      response mustHaveStatus (Status.Ok, Some(expected))
      verify(service).search(searchFilters)
    }

    "return summary of resellable items" in {
      val service = mock[ResellableItemService[IO]]
      when(service.summaries(any[SearchParams])).thenReturnIO(summaries)

      val controller = new ResellableItemController[IO](service)

      val request  = Request[IO](uri = uri"/resellable-items/summary?kind=video-game", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      val expected =
        """{
          |"total":3,
          |"unrecognized":{"total":1,"items":[{"name":"Battlefield 1 XBOX ONE","title":"Battlefield 1","url":"https://www.ebay.co.uk/itm/battlefield-1","buyPrice":32.99,"exchangePrice":null}]},
          |"profitable":{"total":1,"items":[{"name":"super mario 3 XBOX ONE","title":"super mario 3","url":"https://www.ebay.co.uk/itm/super-mario-3","buyPrice":32.99,"exchangePrice":80}]},
          |"rest":{"total":1,"items":[{"name":"Battlefield 1 XBOX ONE","title":"Battlefield 1","url":"https://www.ebay.co.uk/itm/battlefield-1","buyPrice":32.99,"exchangePrice":5}]}
          |}""".stripMargin
      response mustHaveStatus (Status.Ok, Some(expected))
      verify(service).summaries(searchFilters)
    }

    "return summary of video games" in {
      val service = mock[ResellableItemService[IO]]
      when(service.summaries(any[SearchParams])).thenReturnIO(summaries)

      val controller = new ResellableItemController[IO](service)

      val request  = Request[IO](uri = uri"/resellable-items/summary?kind=video-game", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      val expected =
        """{
          |"total":3,
          |"unrecognized":{"total":1,"items":[{"name":"Battlefield 1 XBOX ONE","title":"Battlefield 1","url":"https://www.ebay.co.uk/itm/battlefield-1","buyPrice":32.99,"exchangePrice":null}]},
          |"profitable":{"total":1,"items":[{"name":"super mario 3 XBOX ONE","title":"super mario 3","url":"https://www.ebay.co.uk/itm/super-mario-3","buyPrice":32.99,"exchangePrice":80}]},
          |"rest":{"total":1,"items":[{"name":"Battlefield 1 XBOX ONE","title":"Battlefield 1","url":"https://www.ebay.co.uk/itm/battlefield-1","buyPrice":32.99,"exchangePrice":5}]}
          |}""".stripMargin
      response mustHaveStatus (Status.Ok, Some(expected))
      verify(service).summaries(searchFilters)
    }

    "parse optional query params" in {
      val service = mock[ResellableItemService[IO]]
      when(service.search(any[SearchParams])).thenReturnIO(Nil)

      val controller = new ResellableItemController[IO](service)

      val request =
        Request[IO](uri = uri"/resellable-items?limit=100&from=2020-01-01&to=2020-01-01T00:00:01Z&kind=video-game", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      response mustHaveStatus (Status.Ok, Some("""[]"""))
      verify(service).search(
        searchFilters.copy(
          limit = Some(100),
          from = Some(Instant.parse("2020-01-01T00:00:00Z")),
          to = Some(Instant.parse("2020-01-01T00:00:01Z"))
        )
      )
    }

    "parse date query params" in {
      val service = mock[ResellableItemService[IO]]
      when(service.search(any[SearchParams])).thenReturnIO(Nil)

      val controller = new ResellableItemController[IO](service)

      val request  = Request[IO](uri = uri"/resellable-items?from=2020-01-01&to=2020-01-01T00:00:01", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      response mustHaveStatus (Status.Ok, Some("""[]"""))
      verify(service).search(
        SearchParams(
          from = Some(Instant.parse("2020-01-01T00:00:00Z")),
          to = Some(Instant.parse("2020-01-01T00:00:01Z"))
        )
      )
    }

    "return error on date query param parsing failure" in {
      val service = mock[ResellableItemService[IO]]
      when(service.search(any[SearchParams])).thenReturnIO(Nil)

      val controller = new ResellableItemController[IO](service)

      val request  = Request[IO](uri = uri"/resellable-items?from=foo", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      response mustHaveStatus (Status.BadRequest, Some("""{"message":"Invalid value for: query parameter from"}"""))
      verifyNoInteractions(service)
    }

    "return error when invalid kind passed" in {
      val service = mock[ResellableItemService[IO]]
      when(service.search(any[SearchParams])).thenReturnIO(Nil)

      val controller = new ResellableItemController[IO](service)

      val request  = Request[IO](uri = uri"/resellable-items?kind=foo", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      response mustHaveStatus (Status.BadRequest, Some("""{"message":"Invalid value for: query parameter kind"}"""))
      verifyNoInteractions(service)
    }

    "parse search query params" in {
      val service = mock[ResellableItemService[IO]]
      when(service.search(any[SearchParams])).thenReturnIO(Nil)

      val controller = new ResellableItemController[IO](service)

      val request  = Request[IO](uri = uri"/resellable-items?limit=100&query=foo-bar", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      response mustHaveStatus (Status.Ok, Some("""[]"""))
      verify(service).search(SearchParams(limit = Some(100), query = Some("foo-bar")))
    }

    "return error" in {
      val service = mock[ResellableItemService[IO]]
      when(service.search(any[SearchParams])).thenRaiseError(new RuntimeException("bad request"))

      val controller = new ResellableItemController[IO](service)

      val request  = Request[IO](uri = uri"/resellable-items", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      response mustHaveStatus (Status.InternalServerError, Some("""{"message":"bad request"}"""))
    }
  }
}
