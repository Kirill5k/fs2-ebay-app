package ebayapp.core.controllers

import java.time.Instant
import cats.effect.IO
import ebayapp.core.ControllerSpec
import ebayapp.core.domain.{ItemKind, ResellableItem, ResellableItemBuilder}
import ebayapp.core.domain.search.SellPrice
import ebayapp.core.repositories.Filters
import ebayapp.core.services.ResellableItemService
import org.http4s.implicits._
import org.http4s.{Request, Status, _}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.{verify, verifyNoInteractions, when}

class ResellableItemControllerSpec extends ControllerSpec {

  val postedTs = Instant.ofEpochMilli(1577836800000L)

  val game1 = ResellableItemBuilder.videoGame("super mario 3", postedTs)
  val game2 = ResellableItemBuilder.videoGame("Battlefield 1", postedTs, sellPrice = None)
  val game3 = ResellableItemBuilder.videoGame("Battlefield 1", postedTs, sellPrice = Some(SellPrice(BigDecimal(10), BigDecimal(5))))

  val searchFilters = Filters(ItemKind.VideoGame, None, None, None)

  "A VideoGameController" should {

    "return list of video games" in {
      val service = mock[ResellableItemService[IO]]
      when(service.findAll(any[Filters])).thenReturn(IO.pure(List(game1, game2)))

      val controller = new ResellableItemController[IO]("video-games", ItemKind.VideoGame, service)

      val request  = Request[IO](uri = uri"/video-games", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      val expected =
        """[{
          |"kind": "video-game",
          |"itemDetails":{
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
          |"quantityAvailable":1,
          |"sell":100,
          |"credit":80
          |}
          |},{
          |"kind": "video-game",
          |"itemDetails":{
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
          |"quantityAvailable":1,
          |"sell":null,
          |"credit":null
          |}
          |}]""".stripMargin
      verifyJsonResponse(response, Status.Ok, Some(expected))
      verify(service).findAll(searchFilters)
    }

    "return summary of video games" in {
      val service = mock[ResellableItemService[IO]]
      when(service.findAll(any[Filters])).thenReturn(IO.pure(List(game1, game2, game3)))

      val controller = new ResellableItemController[IO]("video-games", ItemKind.VideoGame, service)

      val request  = Request[IO](uri = uri"/video-games/summary", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      val expected =
        """{
          |"total":3,
          |"unrecognized":{"total":1,"items":[{"name":"Battlefield 1 XBOX ONE","title":"Battlefield 1","url":"https://www.ebay.co.uk/itm/battlefield-1","price":32.99,"exchange":null}]},
          |"profitable":{"total":1,"items":[{"name":"super mario 3 XBOX ONE","title":"super mario 3","url":"https://www.ebay.co.uk/itm/super-mario-3","price":32.99,"exchange":80}]},
          |"rest":{"total":1,"items":[{"name":"Battlefield 1 XBOX ONE","title":"Battlefield 1","url":"https://www.ebay.co.uk/itm/battlefield-1","price":32.99,"exchange":5}]}
          |}""".stripMargin
      verifyJsonResponse(response, Status.Ok, Some(expected))
      verify(service).findAll(searchFilters)
    }

    "parse optional query params" in {
      val service = mock[ResellableItemService[IO]]
      when(service.findAll(any[Filters])).thenReturn(IO.pure(Nil))

      val controller = new ResellableItemController[IO]("video-games", ItemKind.VideoGame, service)

      val request  = Request[IO](uri = uri"/video-games?limit=100&from=2020-01-01&to=2020-01-01T00:00:01Z", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.Ok, Some("""[]"""))
      verify(service).findAll(
        searchFilters.copy(
          limit = Some(100),
          from = Some(Instant.parse("2020-01-01T00:00:00Z")),
          to = Some(Instant.parse("2020-01-01T00:00:01Z"))
        )
      )
    }

    "parse date query params" in {
      val service = mock[ResellableItemService[IO]]
      when(service.findAll(any[Filters])).thenReturn(IO.pure(Nil))

      val controller = new ResellableItemController[IO]("video-games", ItemKind.VideoGame, service)

      val request  = Request[IO](uri = uri"/video-games?from=2020-01-01&to=2020-01-01T00:00:01", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.Ok, Some("""[]"""))
      verify(service).findAll(
        searchFilters.copy(from = Some(Instant.parse("2020-01-01T00:00:00Z")), to = Some(Instant.parse("2020-01-01T00:00:01Z")))
      )
    }

    "return error on date query param parsing failure" in {
      val service = mock[ResellableItemService[IO]]
      when(service.findAll(any[Filters])).thenReturn(IO.pure(Nil))

      val controller = new ResellableItemController[IO]("video-games", ItemKind.VideoGame, service)

      val request  = Request[IO](uri = uri"/video-games?from=foo", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.BadRequest, Some("""{"message":"Invalid value for: query parameter from"}"""))
      verifyNoInteractions(service)
    }

    "parse search query params" in {
      val service = mock[ResellableItemService[IO]]
      when(service.findBy(any[String], any[Filters])).thenReturn(IO.pure(Nil))

      val controller = new ResellableItemController[IO]("video-games", ItemKind.VideoGame, service)

      val request  = Request[IO](uri = uri"/video-games?limit=100&query=foo-bar", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.Ok, Some("""[]"""))
      verify(service).findBy("foo-bar", searchFilters.copy(limit = Some(100)))
    }

    "return error" in {
      val service = mock[ResellableItemService[IO]]
      when(service.findAll(any[Filters]))
        .thenReturn(IO.raiseError(new RuntimeException("bad request")))

      val controller = new ResellableItemController[IO]("video-games", ItemKind.VideoGame, service)

      val request  = Request[IO](uri = uri"/video-games", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.InternalServerError, Some("""{"message":"bad request"}"""))
    }
  }

  def stream(games: ResellableItem*): fs2.Stream[IO, ResellableItem] =
    fs2.Stream.emits(games).covary[IO]
}
