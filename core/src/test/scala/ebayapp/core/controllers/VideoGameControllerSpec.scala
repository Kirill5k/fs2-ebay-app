package ebayapp.core.controllers

import java.time.Instant
import cats.effect.IO
import ebayapp.core.ControllerSpec
import ebayapp.core.domain.ResellableItem.VideoGame
import ebayapp.core.domain.{ItemDetails, ResellableItemBuilder}
import ebayapp.core.domain.search.SellPrice
import ebayapp.core.services.ResellableItemService
import org.http4s.implicits._
import org.http4s.{Request, Status, _}

class VideoGameControllerSpec extends ControllerSpec {

  val postedTs = Instant.ofEpochMilli(1577836800000L)

  val game1 = ResellableItemBuilder.videoGame("super mario 3", postedTs)
  val game2 = ResellableItemBuilder.videoGame("Battlefield 1", postedTs, sellPrice = None)
  val game3 = ResellableItemBuilder.videoGame("Battlefield 1", postedTs, sellPrice = Some(SellPrice(BigDecimal(10), BigDecimal(5))))

  "A VideoGameController" should {

    "return list of video games" in {
      val service = mock[ResellableItemService[IO, ItemDetails.Game]]
      when(service.findAll(any[Option[Int]], any[Option[Instant]], any[Option[Instant]])).thenReturn(IO.pure(List(game1, game2)))

      val controller = new VideoGameController[IO](service)

      val request  = Request[IO](uri = uri"/video-games", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      val expected =
        """[{
          |"itemDetails":{
          |"name":"super mario 3",
          |"platform":"XBOX ONE",
          |"releaseYear":"2019","genre":"Action"
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
      verify(service).findAll(None, None, None)
    }

    "return summary of video games" in {
      val service = mock[ResellableItemService[IO, ItemDetails.Game]]
      when(service.findAll(any[Option[Int]], any[Option[Instant]], any[Option[Instant]])).thenReturn(IO.pure(List(game1, game2, game3)))

      val controller = new VideoGameController[IO](service)

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
      verify(service).findAll(None, None, None)
    }

    "parse optional query params" in {
      val service = mock[ResellableItemService[IO, ItemDetails.Game]]
      when(service.findAll(any[Option[Int]], any[Option[Instant]], any[Option[Instant]])).thenReturn(IO.pure(Nil))

      val controller = new VideoGameController[IO](service)

      val request  = Request[IO](uri = uri"/video-games?limit=100&from=2020-01-01&to=2020-01-01T00:00:01Z", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.Ok, Some("""[]"""))
      verify(service).findAll(Some(100), Some(Instant.parse("2020-01-01T00:00:00Z")), Some(Instant.parse("2020-01-01T00:00:01Z")))
    }

    "parse date query params" in {
      val service = mock[ResellableItemService[IO, ItemDetails.Game]]
      when(service.findAll(any[Option[Int]], any[Option[Instant]], any[Option[Instant]])).thenReturn(IO.pure(Nil))

      val controller = new VideoGameController[IO](service)

      val request  = Request[IO](uri = uri"/video-games?from=2020-01-01&to=2020-01-01T00:00:01", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.Ok, Some("""[]"""))
      verify(service).findAll(None, Some(Instant.parse("2020-01-01T00:00:00Z")), Some(Instant.parse("2020-01-01T00:00:01Z")))
    }

    "parse search query params" in {
      val service = mock[ResellableItemService[IO, ItemDetails.Game]]
      when(service.findBy(any[String], any[Option[Int]], any[Option[Instant]], any[Option[Instant]])).thenReturn(IO.pure(Nil))

      val controller = new VideoGameController[IO](service)

      val request  = Request[IO](uri = uri"/video-games?limit=100&query=foo-bar", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.Ok, Some("""[]"""))
      verify(service).findBy("foo-bar", Some(100), None, None)
    }

    "return error" in {
      val service = mock[ResellableItemService[IO, ItemDetails.Game]]
      when(service.findAll(any[Option[Int]], any[Option[Instant]], any[Option[Instant]]))
        .thenReturn(IO.raiseError(new RuntimeException("bad request")))

      val controller = new VideoGameController[IO](service)

      val request  = Request[IO](uri = uri"/video-games", method = Method.GET)
      val response = controller.routes.orNotFound.run(request)

      verifyJsonResponse(response, Status.InternalServerError, Some("""{"message":"bad request"}"""))
    }
  }

  def stream(games: VideoGame*): fs2.Stream[IO, VideoGame] =
    fs2.Stream.evalSeq(IO.pure(List(games: _*)))
}
